# Zap: GitHub push → knowledge-source table

> **RETIRED (cost).** This Zap and its Zapier Table are no longer live — they
> cost too much to keep running. The chatbot now reads a no-RAG build-time index
> ([`src/pages/chat-index.json.ts`](../src/pages/chat-index.json.ts)) served by
> the static site; see [`docs/chatbot.md`](chatbot.md). This file is kept for
> historical reference only.

Syncs `src/content/posts/*.md` files into the Zapier Table
**`astro-ai-chat - knowledge source`** (table id `01KQB3DZWRTN6SRRCEKN9TCYYT`)
on every push to `main`.

This is the **incremental** sync. The table is bootstrapped once via the CSV
import (`knowledge-source-bootstrap.csv`).

## Plan requirements

This Zap uses three premium Zapier steps:

- **Code by Zapier** (Starter+)
- **Looping by Zapier** (Pro+)
- **Paths by Zapier** (Pro+)

If you're not on Pro, ping me and we'll switch to the GitHub Action route
(free, ~50 lines of Python in `.github/workflows/sync-knowledge.yml`).

## One-time prep

1. **Add a `file_path` column** to the table
   (Zapier Tables UI → table → "+ New Field" → Text). This is the upsert key.

2. **Bootstrap the table** by importing `knowledge-source-bootstrap.csv` from
   the repo root (Zapier Tables UI → "Import" → upload CSV → map columns).
   After this, the table holds all 157 existing posts.

   *(The CSV is gitignored — it lives only on your machine.)*

3. **Make the repo public** if it isn't already, OR generate a GitHub
   Personal Access Token with `contents:read` and store it in a Zapier
   Storage variable named `gh_token`. The Code step pulls raw file contents
   from GitHub — public repos work without auth, private repos need the PAT.

## Zap structure

```
1. Trigger:   GitHub — New Commit (branch: main)
2. Filter:    only continue if changed files include src/content/posts/*.md
3. Code:      Run Python — fetch each changed post + emit upsert records
4. Loop:      iterate over records from step 3
5. Tables:    Find Record by file_path
6. Paths:
   ├─ Path A  (record found)     → Tables: Update Record
   └─ Path B  (record NOT found) → Tables: Create Record
```

## Step-by-step

### 1. Trigger — GitHub: New Commit

- App: **GitHub**
- Event: **New Commit**
- Repository: `alnutile/astro-and-zapier-chat`
- Branch: `main`

This fires once per commit pushed to `main`. The output includes:
`Sha`, `Added` (list), `Modified` (list), `Removed` (list).

### 2. Filter — only run when posts changed

- App: **Filter by Zapier**
- Rule: `Modified` **(Text) Contains** `src/content/posts/`
  - Add an OR rule: `Added` **(Text) Contains** `src/content/posts/`
  - Add an OR rule: `Removed` **(Text) Contains** `src/content/posts/`

This skips pushes that didn't touch any posts (e.g. CSS-only changes).

### 3. Code by Zapier — Run Python

**Input Data** (map these from the trigger):

| Key in Code step | Value from trigger |
| --- | --- |
| `added` | `Added` |
| `modified` | `Modified` |
| `removed` | `Removed` |
| `sha` | `Sha` |

**Code:**

```python
import urllib.request
import re

REPO = 'alnutile/astro-and-zapier-chat'
SITE = 'https://astro-and-zapier-chat-production.up.railway.app'
POSTS_PREFIX = 'src/content/posts/'

def to_list(v):
    if v is None:
        return []
    if isinstance(v, list):
        return v
    # Zapier sometimes flattens lists into a comma-separated string
    return [s.strip() for s in str(v).split(',') if s.strip()]

added    = to_list(input_data.get('added'))
modified = to_list(input_data.get('modified'))
removed  = to_list(input_data.get('removed'))
sha      = input_data.get('sha') or 'main'

def is_post(p):
    return p.startswith(POSTS_PREFIX) and p.endswith('.md')

# If the repo is private, set gh_token here from StoreClient or hard-code a PAT
gh_token = None  # e.g. 'ghp_xxx' for private repos

def fetch(path, ref):
    url = f'https://raw.githubusercontent.com/{REPO}/{ref}/{path}'
    req = urllib.request.Request(url)
    if gh_token:
        req.add_header('Authorization', f'Bearer {gh_token}')
    return urllib.request.urlopen(req, timeout=15).read().decode('utf-8')

FM_RE = re.compile(r'^---\n(.*?)\n---\n?', re.S)

def parse_md(text):
    m = FM_RE.match(text)
    if not m:
        return {}, text
    fm = {}
    for line in m.group(1).splitlines():
        mm = re.match(r'^([a-z_]+):\s*(.*)$', line)
        if not mm:
            continue
        k, v = mm.group(1), mm.group(2)
        if len(v) >= 2 and v.startswith('"') and v.endswith('"'):
            v = v[1:-1].replace('\\"', '"').replace('\\\\', '\\')
        fm[k] = v
    return fm, text[m.end():].lstrip('\n')

records = []

for path in sorted(set(added + modified)):
    if not is_post(path):
        continue
    try:
        text = fetch(path, sha)
    except Exception as e:
        # missing/private/transient — skip; we'll get it next push
        continue
    fm, body = parse_md(text)
    slug = path.rsplit('/', 1)[1][:-3]
    records.append({
        'action': 'upsert',
        'file_path': path,
        'title': fm.get('title', slug),
        'url': f'{SITE}/posts/{slug}',
        'content': body,
        'published': fm.get('date', ''),
    })

for path in sorted(set(removed)):
    if not is_post(path):
        continue
    records.append({
        'action': 'delete',
        'file_path': path,
    })

return {'records': records}
```

### 4. Looping by Zapier — Create Loop from Line Items

- Action: **Create Loop From Line Items**
- Map "Values to Loop Through" to **`records`** from the Code step
- Loop variables to expose (one per record field):
  `action`, `file_path`, `title`, `url`, `content`, `published`

Each loop iteration runs the rest of the steps once per record.

### 5. Zapier Tables — Find Record (by file_path)

- App: **Zapier Tables**
- Action: **Find Record**
- Table: `astro-ai-chat - knowledge source`
- Lookup field: `file_path`
- Lookup value: the loop's **`file_path`**

This returns the existing record (with its Record ID) if found, or empty.

### 6. Paths by Zapier — branch on result

#### Path A — record exists (UPDATE)

- Filter: **Find Record → Record ID — Exists**
- Action: **Zapier Tables — Update Record**
  - Record ID: `Find Record → Record ID`
  - title: loop `title`
  - url: loop `url`
  - content: loop `content`
  - published: loop `published`
  - file_path: loop `file_path` *(in case it ever changed; safe to set every time)*

#### Path B — record does NOT exist (CREATE)

- Filter: **Find Record → Record ID — Does not exist**
- Filter (additional): **Loop → action — (Text) Exactly matches — `upsert`**
  *(don't create rows for deletes that aren't already in the table)*
- Action: **Zapier Tables — Create Record**
  - file_path: loop `file_path`
  - title: loop `title`
  - url: loop `url`
  - content: loop `content`
  - published: loop `published`

### (Optional) Path C — record exists AND action is delete

If you want deletes to clean up the table:

- Filter: **Find Record → Record ID — Exists** AND **Loop → action — Exactly `delete`**
- Action: **Zapier Tables — Delete Record** (Record ID from Find Record)

Skip this path for v1 if you'd rather keep history. Stale rows just won't get
returned by the chat unless their file still exists in the repo.

## Testing

1. Make a tiny edit to one post (e.g. fix a typo in a frontmatter title)
2. `git add -A && git commit -m "test: trigger sync zap" && git push`
3. Watch the Zap History — should see one trigger, one record looped, and an
   Update on Path A
4. Confirm in the Tables UI that the row reflects your edit

## Costs

Each push processing N changed posts uses roughly **2 + 3N tasks**:

- 1 trigger (free)
- 1 filter (free)
- 1 code step (1 task)
- 1 loop start (1 task)
- N × (Find + Path filter + Update/Create) ≈ N × 3 tasks

Touching 2 posts per push ≈ 8 tasks. On Pro (2,000 tasks/month) you can push
~250 times/month before running thin.
