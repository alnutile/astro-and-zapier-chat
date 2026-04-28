---
title: "Pagination and Authentication"
date: 2025-06-18
excerpt: "In this video, I take you through the journey of building an API for UsWork.ai using N8N. I share the real-world ups and downs, from finding jobs to posting proposals, including the tough deployment s"
image: "https://substackcdn.com/image/youtube/w_728,c_limit/YE_v1ov9DBw"
tags: []
# original_url: https://substack.com/home/post/p-166273457
---

The workflow JSON is below:

```
{
  "nodes": [
    {
      "parameters": {
        "content": "## Index API",
        "height": 140
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -940,
        -440
      ],
      "id": "116fcd89-df5d-49e8-a5dc-ee0d7af90e84",
      "name": "Sticky Note"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "5364e106-07bb-4158-bca1-9c2a93dc287f",
              "leftValue": "={{ $json }}",
              "rightValue": "",
              "operator": {
                "type": "object",
                "operation": "notEmpty",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        -480,
        -240
      ],
      "id": "6ea97347-cbfd-4630-a0f6-8a9a00b79fa3",
      "name": "IfAuthenticated"
    },
    {
      "parameters": {
        "respondWith": "allIncomingItems",
        "options": {
          "responseCode": 200
        }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        1240,
        -380
      ],
      "id": "1c6b336b-2484-43bd-9ce2-278a0fb2f377",
      "name": "Respond to Webhook1"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT id, title, description, status, created_at\nFROM job_postings\nWHERE\n  (created_at::date, id) > (\n      COALESCE($1::timestamp, '9999-12-31'),\n      COALESCE($2::uuid, 'ffffffff-ffff-ffff-ffff-ffffffffffff')\n  )\n  AND status = 'available'\nORDER BY created_at::date DESC, id DESC\nLIMIT $3+1;",
        "options": {
          "queryReplacement": "={{ $json.cursor_created_at }},{{ $json.cursor_id || $json.cursor_default}},{{ $json.limit }}"
        }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.5,
      "position": [
        380,
        -420
      ],
      "id": "0a26c8c5-9027-4acd-8c33-d84842f34bd9",
      "name": "Postgres",
      "alwaysOutputData": true,
      "credentials": {
        "postgres": {
          "id": "xkBc3U4KN6H3qi0M",
          "name": "Supabase Postgres"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "18275e2c-f606-4d3a-9597-c9809fde5a90",
              "name": "cursor_id",
              "value": "={{ $('Index').item.json.query.cursor_id || null }}",
              "type": "string"
            },
            {
              "id": "899fc5c5-6970-48ff-91d9-ef6e67582844",
              "name": "limit",
              "value": "={{ Math.min(Number($('Index').item.json.query?.limit) || 10, 100) }}",
              "type": "number"
            },
            {
              "id": "a755be91-10bd-414d-a2a9-287b21f5f885",
              "name": "cursor_created_at",
              "value": "={{ $('Index').item.json.query.cursor_created_at || $now.minus(1, 'days').format('yyyy-MM-dd') }}",
              "type": "string"
            },
            {
              "id": "b129f79e-7f5a-4b09-9cf9-5ed48e17d545",
              "name": "cursor_default",
              "value": "={{ $json.id }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        100,
        -420
      ],
      "id": "d5a017de-2149-4610-8fe1-0887da861524",
      "name": "Args"
    },
    {
      "parameters": {
        "aggregate": "aggregateAllItemData",
        "options": {}
      },
      "type": "n8n-nodes-base.aggregate",
      "typeVersion": 1,
      "position": [
        640,
        -420
      ],
      "id": "f072ea9a-be04-4dac-990b-99f2c4f2330d",
      "name": "Aggregate1"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "0c05f1b6-59b4-4847-80a8-9e7fbbfe6279",
              "name": "data",
              "value": "={{ $json.data }}",
              "type": "array"
            },
            {
              "id": "7a7b9c11-b464-4685-a718-64b9f66e9cef",
              "name": "pagination.count",
              "value": "={{ $json.data.length }}",
              "type": "number"
            },
            {
              "id": "4af17b4c-e006-48d6-a57c-29682f845415",
              "name": "pagination.per_page",
              "value": "={{ $('Args').item.json.limit }}",
              "type": "number"
            },
            {
              "id": "3b7d37fa-5d61-4765-bd3b-d8c3d560b42b",
              "name": "pagination.next_cursor",
              "value": "={{ $json.data.length > 0 ? $json.data[$json.data.length - 1].id : null }}",
              "type": "string"
            },
            {
              "id": "930cb30e-ff4e-438d-a4b8-cad7fe3234ee",
              "name": "pagination.next_created_at",
              "value": "={{ $json.data.length > 0 ? $json.data[$json.data.length - 1].created_at : null }}",
              "type": "string"
            },
            {
              "id": "43096653-144c-4e97-9e9f-5f334321aa16",
              "name": "has_next_page",
              "value": false,
              "type": "boolean"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1000,
        -380
      ],
      "id": "5287d557-d002-40e0-b0da-7dff93c9d84a",
      "name": "Response"
    },
    {
      "parameters": {
        "content": "## API Post a Job Proposal",
        "width": 400
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -960,
        200
      ],
      "id": "b7b2c324-8f41-44b4-9303-25e3fca4c615",
      "name": "Sticky Note1"
    },
    {
      "parameters": {
        "path": "/api/job_postings",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        -920,
        -240
      ],
      "id": "6c01b70a-31c1-4a32-954c-3aa306c2aaa0",
      "name": "Index",
      "webhookId": "193061f4-83c0-4f7d-8d6b-0d260838c0cf"
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "job_proposals/create",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        -920,
        440
      ],
      "id": "12223ebb-8e2f-4802-9307-3207d9168baf",
      "name": "CreateProposal",
      "webhookId": "cc54c2c1-a220-4dad-be32-76d28d1b9000"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "f7a23904-ec94-4ee9-bc5c-d79a52e124fa",
              "leftValue": "={{ $('CreateProposal').item.json.body.content }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "notEmpty",
                "singleValue": true
              }
            },
            {
              "id": "c7c74677-bd63-42f3-970f-0f6c2b9a7580",
              "leftValue": "={{ $('CreateProposal').item.json.body.job_id }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "notEmpty",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        -80,
        420
      ],
      "id": "44dbc7f6-7cda-42f2-939d-9fafeaecc4ba",
      "name": "IfValid"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "5364e106-07bb-4158-bca1-9c2a93dc287f",
              "leftValue": "={{ $json }}",
              "rightValue": "",
              "operator": {
                "type": "object",
                "operation": "notEmpty",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        -440,
        440
      ],
      "id": "f98c1423-766f-4242-851a-2b37bc0b1494",
      "name": "IfAuthenticated1"
    },
    {
      "parameters": {
        "respondWith": "noData",
        "options": {
          "responseCode": 404
        }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        340,
        0
      ],
      "id": "26052ef0-6daa-42ac-b285-a18ce7b44c88",
      "name": "NotAuthenticated"
    },
    {
      "parameters": {
        "respondWith": "allIncomingItems",
        "options": {
          "responseCode": 200
        }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        1180,
        180
      ],
      "id": "a0e8a60c-be25-4488-86bb-ec11077f0d42",
      "name": "Respond to Webhook"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "213e53f4-3cfc-40c0-a3d0-1bbb005e42c5",
              "leftValue": "={{$json}}",
              "rightValue": "",
              "operator": {
                "type": "object",
                "operation": "empty",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        520,
        280
      ],
      "id": "8dfd3866-e194-41c1-b448-35cbe1b53eb0",
      "name": "IfNotDuplicate"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{\n  \"errors\": [\n    \"Duplicate\"\n  ]\n}",
        "options": {
          "responseCode": 422
        }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        900,
        580
      ],
      "id": "885c7fd2-d674-4b74-b5fb-21df1a9f5ac2",
      "name": "Respond to Webhook2"
    },
    {
      "parameters": {
        "tableId": "job_proposals",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "job_id",
              "fieldValue": "={{ $('CreateProposal').item.json.body.job_id }}"
            },
            {
              "fieldId": "user_id",
              "fieldValue": "={{ $('IfValid').item.json.user_id }}"
            },
            {
              "fieldId": "content",
              "fieldValue": "={{ $('CreateProposal').item.json.body.content }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        900,
        180
      ],
      "id": "2970f2fa-53e7-4ba1-b5f0-2cab1f893cf4",
      "name": "Supabase1",
      "credentials": {
        "supabaseApi": {
          "id": "17CivS2ZFGNKSLb5",
          "name": "Supabase account"
        }
      }
    },
    {
      "parameters": {
        "operation": "get",
        "tableId": "job_proposals",
        "filters": {
          "conditions": [
            {
              "keyName": "job_id",
              "keyValue": "={{ $('CreateProposal').item.json.body.job_id }}"
            },
            {
              "keyName": "user_id",
              "keyValue": "={{ $json.user_id }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        260,
        280
      ],
      "id": "9ea65049-be3a-4d53-a3df-f092a8fa57f2",
      "name": "Exists",
      "alwaysOutputData": true,
      "credentials": {
        "supabaseApi": {
          "id": "17CivS2ZFGNKSLb5",
          "name": "Supabase account"
        }
      }
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT at.*, s.*\nFROM api_tokens at\nJOIN subscriptions s ON s.user_id = at.user_id\nWHERE\n    at.token_hash = $1\n    AND s.status LIKE 'active'",
        "options": {
          "queryReplacement": "={{ $json.body.api_key }}"
        }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.5,
      "position": [
        -700,
        440
      ],
      "id": "eedc1a24-ac34-497a-8566-219459415995",
      "name": "ActiveAndValidToken",
      "alwaysOutputData": true,
      "credentials": {
        "postgres": {
          "id": "xkBc3U4KN6H3qi0M",
          "name": "Supabase Postgres"
        }
      }
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT at.*, s.*\nFROM api_tokens at\nJOIN subscriptions s ON s.user_id = at.user_id\nWHERE\n    at.token_hash = $1\n    AND s.status = 'active'",
        "options": {
          "queryReplacement": "={{ $json.query.api_key }}"
        }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.5,
      "position": [
        -720,
        -240
      ],
      "id": "5cb89af3-042f-4630-9c2c-de7b263aa7bc",
      "name": "ActiveAndValidToken1",
      "alwaysOutputData": true,
      "credentials": {
        "postgres": {
          "id": "xkBc3U4KN6H3qi0M",
          "name": "Supabase Postgres"
        }
      }
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{\n  \"errors\": [\n    \"Missing job_id or content\"\n  ]\n}",
        "options": {
          "responseCode": 403
        }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        240,
        560
      ],
      "id": "00e51525-e2cd-48a0-8df4-ce7bc21c1fed",
      "name": "Respond to Webhook3"
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "job_postings",
          "mode": "list",
          "cachedResultName": "job_postings"
        },
        "limit": 1,
        "sort": {
          "values": [
            {
              "column": "created_at"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -160,
        -400
      ],
      "id": "193c7e1f-b605-46b4-a490-747130cec6fd",
      "name": "Default",
      "credentials": {
        "postgres": {
          "id": "xkBc3U4KN6H3qi0M",
          "name": "Supabase Postgres"
        }
      }
    }
  ],
  "connections": {
    "IfAuthenticated": {
      "main": [
        [
          {
            "node": "Default",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "NotAuthenticated",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Postgres": {
      "main": [
        [
          {
            "node": "Aggregate1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Args": {
      "main": [
        [
          {
            "node": "Postgres",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Aggregate1": {
      "main": [
        [
          {
            "node": "Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Index": {
      "main": [
        [
          {
            "node": "ActiveAndValidToken1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "CreateProposal": {
      "main": [
        [
          {
            "node": "ActiveAndValidToken",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "IfValid": {
      "main": [
        [
          {
            "node": "Exists",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Respond to Webhook3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "IfAuthenticated1": {
      "main": [
        [
          {
            "node": "IfValid",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "NotAuthenticated",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "IfNotDuplicate": {
      "main": [
        [
          {
            "node": "Supabase1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Respond to Webhook2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase1": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Exists": {
      "main": [
        [
          {
            "node": "IfNotDuplicate",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "ActiveAndValidToken": {
      "main": [
        [
          {
            "node": "IfAuthenticated1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "ActiveAndValidToken1": {
      "main": [
        [
          {
            "node": "IfAuthenticated",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Default": {
      "main": [
        [
          {
            "node": "Args",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "Index": [
      {
        "headers": {
          "host": "n8n-uswork.apps.thedailyaistudio.com",
          "user-agent": "PostmanRuntime/7.43.3",
          "accept": "application/json",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "application/json",
          "authorization": "Bearer gvgw3lhbxJWi4vVimwVqOUk9QcJiqK0cMlCK8lbRIwtHC6Pm",
          "content-type": "application/json",
          "postman-token": "da908679-fe31-44f7-bea2-beb95e25940e",
          "x-forwarded-for": "24.60.183.124",
          "x-forwarded-host": "n8n-uswork.apps.thedailyaistudio.com",
          "x-forwarded-port": "443",
          "x-forwarded-proto": "https",
          "x-forwarded-server": "536677c81f48",
          "x-real-ip": "24.60.183.124"
        },
        "params": {},
        "query": {
          "limit": "1",
          "api_key": "gvgw3lhbxJWi4vVimwVqOUk9QcJiqK0cMlCK8lbRIwtHC6Pm"
        },
        "body": {},
        "webhookUrl": "https://n8n-uswork.apps.thedailyaistudio.com/webhook/api/job_postings",
        "executionMode": "production"
      }
    ],
    "CreateProposal": [
      {
        "headers": {
          "host": "n8n-uswork.apps.thedailyaistudio.com",
          "user-agent": "PostmanRuntime/7.43.3",
          "content-length": "194",
          "accept": "application/json",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "application/json",
          "authorization": "Bearer 12345",
          "content-type": "application/json",
          "postman-token": "f350bbc5-a82e-4fb6-9776-b4ba69c35dff",
          "x-forwarded-for": "24.60.183.124",
          "x-forwarded-host": "n8n-uswork.apps.thedailyaistudio.com",
          "x-forwarded-port": "443",
          "x-forwarded-proto": "https",
          "x-forwarded-server": "536677c81f48",
          "x-real-ip": "24.60.183.124"
        },
        "params": {},
        "query": {},
        "body": {
          "job_id": "5db6a039-9f21-4662-abe6-0dfd2899405c",
          "api_key": "kh9Q0iPZgoUpEmUCzw8aDhhXHDHW9AOgBH6PdIJWRJiHH329",
          "content": "This is my proposal for the job. I have experience with..."
        },
        "webhookUrl": "https://n8n-uswork.apps.thedailyaistudio.com/webhook/job_proposals/create",
        "executionMode": "production"
      }
    ]
  },
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "d4013cd2553a8175175b59d192b506cb636ed9d719b621634b1dcf31941cb2e5"
  }
}
```

---POSTBREAK---

