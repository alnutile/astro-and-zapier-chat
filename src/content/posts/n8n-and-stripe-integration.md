---
title: "N8N and Stripe Integration"
date: 2025-06-18
excerpt: "This is the N8N Json seen in the video"
image: "https://substackcdn.com/image/youtube/w_728,c_limit/KoqF3xaw_iE"
tags: []
# original_url: https://substack.com/home/post/p-166271844
---

This workflow is below and the video is here 

Really nice way to do stripe for your applications!

Here is the scheme a for that table:

```
create table public.subscriptions (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  status text not null,
  price_id text null,
  quantity integer null,
  cancel_at_period_end boolean null default false,
  cancel_at timestamp with time zone null,
  canceled_at timestamp with time zone null,
  current_period_start timestamp with time zone null,
  current_period_end timestamp with time zone null,
  created timestamp with time zone null default now(),
  ended_at timestamp with time zone null,
  trial_start timestamp with time zone null,
  trial_end timestamp with time zone null,
  updated_at timestamp with time zone null default now(),
  subscription_id text null,
  customer_id text null,
  constraint subscriptions_pkey primary key (id),
  constraint idx_subscriptions_user_id unique (user_id),
  constraint subscriptions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint subscriptions_status_check check (
    (
      status = any (
        array[
          'active'::text,
          'trialing'::text,
          'canceled'::text,
          'incomplete'::text,
          'incomplete_expired'::text,
          'past_due'::text,
          'unpaid'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;
```

here is the JSON for N8N
```

{
  "nodes": [
    {
      "parameters": {
        "path": "petdiary/events",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        280,
        20
      ],
      "id": "af7f0c95-eea1-4599-a6a5-b7e8676c62c0",
      "name": "Stripe",
      "webhookId": "cb8dcddd-bb7a-4f8e-bd16-75864e5d348b"
    },
    {
      "parameters": {
        "path": "stripe_payment",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        280,
        400
      ],
      "id": "abb76335-60c8-4fa1-8b56-d387243ccd4c",
      "name": "GetClientReferenceId",
      "webhookId": "a98d1dba-9534-471d-87e4-d9085b03728b"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.stripe.com/v1/checkout/sessions",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "stripeApi",
        "sendBody": true,
        "contentType": "form-urlencoded",
        "bodyParameters": {
          "parameters": [
            {
              "name": "client_reference_id",
              "value": "={{ $json.client_reference_id }}"
            },
            {
              "name": "success_url",
              "value": "={{ $json.success_url }}?client_reference_id={{ $json.client_reference_id }}&price_id={{ $json.price_id }}&session_id={CHECKOUT_SESSION_ID}"
            },
            {
              "name": "cancel_url",
              "value": "={{ $json.canceled }}"
            },
            {
              "name": "line_items[0][price]",
              "value": "={{ $json.price_id }}"
            },
            {
              "name": "line_items[0][quantity]",
              "value": "={{ $json.quantity }}"
            },
            {
              "name": "mode",
              "value": "subscription"
            },
            {
              "name": "customer_email",
              "value": "={{ $json.customer_email }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        820,
        400
      ],
      "id": "a6c515f6-b0c5-4422-9b61-65d0f3c2e3b2",
      "name": "HTTP Request",
      "credentials": {
        "stripeApi": {
          "id": "Cb9cokEpqmGTEhUH",
          "name": "Stripe Test DailyAi"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "7821486e-5b97-4c9e-8c66-262993cad5b4",
              "name": "price_id",
              "value": "price_1R81rjDtrQsiGw9vX9uVolSU",
              "type": "string"
            },
            {
              "id": "372d3bc9-1a99-4da5-b151-8217d942f9df",
              "name": "quantity",
              "value": 1,
              "type": "number"
            },
            {
              "id": "29c0908f-2780-442f-9a10-d411fe763e25",
              "name": "client_reference_id",
              "value": "={{ $json.query.client_reference_id }}",
              "type": "string"
            },
            {
              "id": "33a749ab-cf01-4f83-99e5-ccd1a0235f3a",
              "name": "success_url",
              "value": "https://n8n-do.dailyai.studio/webhook/stripe/success",
              "type": "string"
            },
            {
              "id": "a77beff8-fa02-4ff8-9a07-cf9412a943fb",
              "name": "customer_email",
              "value": "={{ $json.query.customer_email }}",
              "type": "string"
            },
            {
              "id": "23b74d38-5bb8-4223-a52f-fb9c133c62b9",
              "name": "canceled",
              "value": "https://n8n-do.dailyai.studio/webhook/stripe/canceled",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        500,
        400
      ],
      "id": "f23dbcac-b967-4c44-a302-4993d8a86ae9",
      "name": "vars"
    },
    {
      "parameters": {
        "path": "stripe/success",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        280,
        680
      ],
      "id": "47d75859-0e31-47f0-9aff-cc2662b86484",
      "name": "SuccessUrl",
      "webhookId": "c7dae780-bedd-43b3-b4f8-35316ecf31dd"
    },
    {
      "parameters": {
        "content": "## Going live\n\nChange the values in Vars",
        "height": 300,
        "color": 5
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        440,
        280
      ],
      "typeVersion": 1,
      "id": "16953eda-eda3-4219-8014-f371ddb43c4d",
      "name": "Sticky Note"
    },
    {
      "parameters": {
        "content": "## Stripe Webhooks\n\n"
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        0,
        0
      ],
      "typeVersion": 1,
      "id": "e3e6829c-508b-49f7-8868-347d7f4f036d",
      "name": "Sticky Note1"
    },
    {
      "parameters": {
        "content": "## Success URL Comes here\n\n"
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        0,
        660
      ],
      "typeVersion": 1,
      "id": "940f3104-599d-4865-914d-dd00061fffbb",
      "name": "Sticky Note2"
    },
    {
      "parameters": {
        "content": "## Kicks off Sale\n\nClick this to try it [here](https://n8n-petdiary.apps.thedailyaistudio.com/webhook/stripe_payment?user_id=1f8a2cea-8b6a-475f-bcc1-ddcd9b40a887&email=alfred%40thedailyaistudio.com)",
        "height": 260,
        "width": 520
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        -280,
        280
      ],
      "typeVersion": 1,
      "id": "f83af141-f56a-4f1c-bbb7-85e10669d2ec",
      "name": "Sticky Note3"
    },
    {
      "parameters": {
        "respondWith": "redirect",
        "redirectURL": "={{ $json.url }}",
        "options": {
          "responseCode": 302
        }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.2,
      "position": [
        1100,
        400
      ],
      "id": "17ca4a7f-7dde-4839-b455-c31acc67d2e8",
      "name": "Respond to Webhook"
    },
    {
      "parameters": {
        "content": "## Cancelled\neg they click the button to cancel\nso we redirect them\nduring for sign up only"
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        0,
        960
      ],
      "typeVersion": 1,
      "id": "52ea831e-4ecb-4d35-96b9-732c423a3e21",
      "name": "Sticky Note4"
    },
    {
      "parameters": {
        "path": "stripe/canceled",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        260,
        980
      ],
      "id": "4cf70fee-9317-4cb1-8a0b-570763fac103",
      "name": "Cacneled",
      "webhookId": "c7dae780-bedd-43b3-b4f8-35316ecf31dd"
    },
    {
      "parameters": {
        "respondWith": "redirect",
        "redirectURL": "={{ $('success_vars').item.json.product_url }}",
        "options": {
          "responseCode": 302
        }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.2,
      "position": [
        1160,
        680
      ],
      "id": "e5e1520e-9ae5-49d2-a2bc-aa55f7a984f8",
      "name": "Respond to Webhook1"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "201ee2a6-7556-4fc4-b6a5-4eaf68feca6c",
              "name": "product_url",
              "value": "https://app.uswork.ai/dashboard",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        520,
        680
      ],
      "id": "495af294-530e-4ff5-a2ae-e1837008da95",
      "name": "success_vars"
    },
    {
      "parameters": {
        "tableId": "subscriptions",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "user_id",
              "fieldValue": "={{ $('SuccessUrl').item.json.query.client_reference_id }}"
            },
            {
              "fieldId": "price_id",
              "fieldValue": "={{ $('SuccessUrl').item.json.query.price_id }}"
            },
            {
              "fieldId": "status",
              "fieldValue": "active"
            },
            {
              "fieldId": "created",
              "fieldValue": "={{ $now }}"
            },
            {
              "fieldId": "quantity",
              "fieldValue": "1"
            },
            {
              "fieldId": "subscription_id",
              "fieldValue": "={{ $json.subscription }}"
            },
            {
              "fieldId": "customer_id",
              "fieldValue": "={{ $json.customer }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        940,
        680
      ],
      "id": "ce28a5a9-9bd4-4a50-9a94-498c0a04bcb9",
      "name": "Supabase",
      "credentials": {
        "supabaseApi": {
          "id": "hdp5G1na1KaXZyy0",
          "name": "Uswork Ai"
        }
      }
    },
    {
      "parameters": {
        "url": "=https://api.stripe.com/v1/checkout/sessions/{{ $('SuccessUrl').item.json.query.session_id }}",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "stripeApi",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        740,
        680
      ],
      "id": "0a33a908-d168-4724-b58e-1993a0d2e53a",
      "name": "HTTP Request1",
      "credentials": {
        "stripeApi": {
          "id": "Cb9cokEpqmGTEhUH",
          "name": "Stripe Test DailyAi"
        }
      }
    }
  ],
  "connections": {
    "GetClientReferenceId": {
      "main": [
        [
          {
            "node": "vars",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request": {
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
    "vars": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "SuccessUrl": {
      "main": [
        [
          {
            "node": "success_vars",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "success_vars": {
      "main": [
        [
          {
            "node": "HTTP Request1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase": {
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
    "HTTP Request1": {
      "main": [
        [
          {
            "node": "Supabase",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "GetClientReferenceId": [
      {
        "headers": {
          "connection": "upgrade",
          "host": "n8n-do.dailyai.studio",
          "x-real-ip": "24.60.183.124",
          "x-forwarded-for": "24.60.183.124",
          "x-forwarded-proto": "https",
          "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "upgrade-insecure-requests": "1",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "sec-fetch-site": "cross-site",
          "sec-fetch-mode": "navigate",
          "sec-fetch-user": "?1",
          "sec-fetch-dest": "document",
          "referer": "http://localhost:3000/",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "priority": "u=0, i",
          "cookie": "rl_page_init_referrer=RudderEncrypt%3AU2FsdGVkX1%2BPVABvZcPH4JnwPwO47ckAkGy%2BCiIXIe4%3D; rl_page_init_referring_domain=RudderEncrypt%3AU2FsdGVkX1%2FJIfTktl3mIdJNURMI7%2Fz0QRd9a2djEBs%3D; _ga=GA1.1.1986378360.1747931144; _ga_52FXV6SR7W=GS2.1.s1747931143$o1$g0$t1747931143$j0$l0$h0; _clck=1e58avj%7C2%7Cfw9%7C0%7C1973; FPID=FPID2.2.j2LF59xDJnqNAByiMSV%2BCNSMl%2F6RSHsQ%2Fa%2BObfIp%2BRA%3D.1747931144; FPAU=1.2.916595371.1748306081; _ga_DTMZKSKYTE=GS2.1.s1748392819$o2$g0$t1748392819$j0$l0$h183532608$dN5pr-AWH_sQcHkxJah0-PAlVMOcW5nxxtA; _ga_TB5D1N0K99=GS2.1.s1748392819$o2$g0$t1748392819$j0$l0$h203050721$dShLqIXF6cS0EaCqPoLDie1xDuiYoVVoDCw; n8n-auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0NjViY2U0LTA5ZmUtNGNiMy04YjQxLWI0ZGNlN2FlYjI0MSIsImhhc2giOiI2T3lvN2ZFSGowIiwiYnJvd3NlcklkIjoiZjYvYVl1ODlxVTVFZE02TzdHNHFmTDBZaVFHT0RqZ1U3aHUreDdlTysyaz0iLCJpYXQiOjE3NDg4ODA3MzMsImV4cCI6MTc0OTQ4NTUzM30.jUw0s6g25n5Swi5uGo_1fsDYw4LftwsPSRfrOSe66sU; _ga_TH3MWLR44Y=GS2.1.s1749241829$o12$g1$t1749242326$j41$l0$h0; rl_anonymous_id=RudderEncrypt%3AU2FsdGVkX19DLIystLCiAm9LnfIaHm8cqJah5FL0DK4c%2By2rW%2BYOcZjpRUFoIDWFS9cx7hwFQSGvvxIHhEjK%2BQ%3D%3D; rl_user_id=RudderEncrypt%3AU2FsdGVkX1%2BT8A8xUPPFqVCOjDnOPMG9voZArxfnNU7SBdVEJcAwF44DjI7eYUbdkAYQFVTdUiEnAG9Q2xwKg9vEpN75ZJjtw23Av8mNhIz0hCNm8y6FFx6S77Ygjsnl3xyzuE5mC9nP6QxI%2FqgVgFQ0z%2Bs4DJLsF%2FDbwTH8bEU%3D; rl_trait=RudderEncrypt%3AU2FsdGVkX19p2AWXYqhK08a69UihNu%2Bn7RUqd%2B%2FIrEmcL72Ck%2FRyKWrczv%2FF2OpJJmAqOlp5PE2ZcaqMmqTT%2BQNiGVWKnKSYQpidlMnJWNTPvFimVCZbRsoXIRSMcmm755FsD1JlHa3a5j7b8JNlSA%3D%3D; ph_phc_4URIAm1uYfJO7j8kWSe0J8lc8IqnstRLS7Jx8NcakHo_posthog=%7B%22distinct_id%22%3A%22b77b374d91a001765a8bf2832badc1f8fcc5407c99c4c6f3f68d6413d663ef83%235465bce4-09fe-4cb3-8b41-b4dce7aeb241%22%2C%22%24sesid%22%3A%5B1749242449044%2C%22019746f6-3f9b-7480-9b12-93da9eba1cc6%22%2C1749242232730%5D%2C%22%24epp%22%3Atrue%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22%24direct%22%2C%22u%22%3A%22https%3A%2F%2Fn8n-do.dailyai.studio%2Fsignin%3Fredirect%3D%25252Fhome%25252Fworkflows%22%7D%7D; rl_session=RudderEncrypt%3AU2FsdGVkX19sD2vERKEpZ4zAwBHU05s0odEmvCDF1MvPQqtqBLEOU%2BE8LPeuQQ1hB6FRHrNh39155sDj%2F97MkKR7l7rRIe97WQpVTG00alL73m5Pk9PuMgAD8%2FCXFF8gXEHJkoeTxaIOAgauNBAmZg%3D%3D"
        },
        "params": {},
        "query": {
          "client_reference_id": "54d97f73-f3db-44c8-b252-d4d01e7e5c5e",
          "customer_email": "alfred+100@thedailyaistudio.com"
        },
        "body": {},
        "webhookUrl": "https://n8n-do.dailyai.studio/webhook/stripe_payment",
        "executionMode": "production"
      }
    ],
    "SuccessUrl": [
      {
        "headers": {
          "connection": "upgrade",
          "host": "n8n-do.dailyai.studio",
          "x-real-ip": "24.60.183.124",
          "x-forwarded-for": "24.60.183.124",
          "x-forwarded-proto": "https",
          "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "upgrade-insecure-requests": "1",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "sec-fetch-site": "cross-site",
          "sec-fetch-mode": "navigate",
          "sec-fetch-dest": "document",
          "referer": "https://checkout.stripe.com/",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "priority": "u=0, i",
          "cookie": "rl_page_init_referrer=RudderEncrypt%3AU2FsdGVkX1%2BPVABvZcPH4JnwPwO47ckAkGy%2BCiIXIe4%3D; rl_page_init_referring_domain=RudderEncrypt%3AU2FsdGVkX1%2FJIfTktl3mIdJNURMI7%2Fz0QRd9a2djEBs%3D; _ga=GA1.1.1986378360.1747931144; _ga_52FXV6SR7W=GS2.1.s1747931143$o1$g0$t1747931143$j0$l0$h0; _clck=1e58avj%7C2%7Cfw9%7C0%7C1973; FPID=FPID2.2.j2LF59xDJnqNAByiMSV%2BCNSMl%2F6RSHsQ%2Fa%2BObfIp%2BRA%3D.1747931144; FPAU=1.2.916595371.1748306081; _ga_DTMZKSKYTE=GS2.1.s1748392819$o2$g0$t1748392819$j0$l0$h183532608$dN5pr-AWH_sQcHkxJah0-PAlVMOcW5nxxtA; _ga_TB5D1N0K99=GS2.1.s1748392819$o2$g0$t1748392819$j0$l0$h203050721$dShLqIXF6cS0EaCqPoLDie1xDuiYoVVoDCw; n8n-auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0NjViY2U0LTA5ZmUtNGNiMy04YjQxLWI0ZGNlN2FlYjI0MSIsImhhc2giOiI2T3lvN2ZFSGowIiwiYnJvd3NlcklkIjoiZjYvYVl1ODlxVTVFZE02TzdHNHFmTDBZaVFHT0RqZ1U3aHUreDdlTysyaz0iLCJpYXQiOjE3NDg4ODA3MzMsImV4cCI6MTc0OTQ4NTUzM30.jUw0s6g25n5Swi5uGo_1fsDYw4LftwsPSRfrOSe66sU; _ga_TH3MWLR44Y=GS2.1.s1749241829$o12$g1$t1749242326$j41$l0$h0; rl_anonymous_id=RudderEncrypt%3AU2FsdGVkX19M3wp6k%2B9PdnKoiqb%2BuBwyBMpvuNN3xnqynl1IIZF15KCPuKKIZgSoXcXYtKL%2FKUU4p0soN%2B1F6w%3D%3D; rl_user_id=RudderEncrypt%3AU2FsdGVkX1%2BxLMX0bJswKsF4KIGGteYLJP04DIUS85qQPaQ%2BtruoPX2C7f2XTta4E%2BC8Nbyf11Wm3%2Fzb8u4kGyIfX2qOHv%2FkVu4issTgo9GXUgDy9yIG8bqFwa%2BNak71ODZdQpButbM6pzphCEhIStRdNlTYyC5sE10d1iCFWS4%3D; rl_trait=RudderEncrypt%3AU2FsdGVkX1%2FKKgFYM5O%2FoHJMdZ408gp0EjzA1YvBxL0ygKLHMahJOJpTZOk9VWutoKEg4DJO1mrZP7vnlRYA8xC15g%2FmHvpPZbJE8TMkbTJEDeAVa2wjqT8ljOBn1JMxg%2FpSXpbqDKqfUP6czxj6pA%3D%3D; ph_phc_4URIAm1uYfJO7j8kWSe0J8lc8IqnstRLS7Jx8NcakHo_posthog=%7B%22distinct_id%22%3A%22b77b374d91a001765a8bf2832badc1f8fcc5407c99c4c6f3f68d6413d663ef83%235465bce4-09fe-4cb3-8b41-b4dce7aeb241%22%2C%22%24sesid%22%3A%5B1749243411286%2C%22019746f6-3f9b-7480-9b12-93da9eba1cc6%22%2C1749242232730%5D%2C%22%24epp%22%3Atrue%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22%24direct%22%2C%22u%22%3A%22https%3A%2F%2Fn8n-do.dailyai.studio%2Fsignin%3Fredirect%3D%25252Fhome%25252Fworkflows%22%7D%7D; rl_session=RudderEncrypt%3AU2FsdGVkX1%2FDgdHEo%2F9Ez4Lcj7n0033XcPoll10SeKu5SX6AL%2Bg4M5otpYgRnccsn%2BGV0tVz3DBEUJL4n%2FwI3S%2FKpChvSaLXOSx7nRtLgXeV8B9cU%2FcOGZV7p%2BVA%2BNv5Y1EqlKvIcrIxV%2BkkziKewQ%3D%3D"
        },
        "params": {},
        "query": {
          "client_reference_id": "54d97f73-f3db-44c8-b252-d4d01e7e5c5e",
          "price_id": "price_1R81rjDtrQsiGw9vX9uVolSU",
          "session_id": "cs_test_a1Q4gxd6RCxItNvVlMvl6MHIrrR6qPWMiIgAQNB1TYjp8XNAyTQUDwMFbg"
        },
        "body": {},
        "webhookUrl": "https://n8n-do.dailyai.studio/webhook/stripe/success",
        "executionMode": "production"
      }
    ]
  },
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "b77b374d91a001765a8bf2832badc1f8fcc5407c99c4c6f3f68d6413d663ef83"
  }
}
```

---POSTBREAK---

