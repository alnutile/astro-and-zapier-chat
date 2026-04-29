---
title: "Email to Google Sheets - N8N and Simple Automations"
date: 2025-06-28
excerpt: "Tutorial for citizen developers who want to stop manually copying data from emails."
image: "https://substackcdn.com/image/fetch/$s_!OGkv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd9a1e628-823a-4c47-bc41-4f90d870572a_2806x1730.png"
tags: []
# original_url: https://substack.com/home/post/p-166991886
---

One of the fastest wins you can get with automation is this:
> 
**Automatically extract info from your emails and log it in a Google Sheet.**

Whether you’re tracking leads, saving recipes, managing tasks, or just bookmarking things you email yourself, this workflow replaces manual copy-paste with something reliable, repeatable, and low-stress.

And with **n8n**, you don’t need to code to make it happen.

### 🛠 What You’ll Build

This automation will:

- 
**Listen to an email inbox**

- 
**Extract data from the subject or body**

- 
**Append it to a Google Sheet**

- 
Optionally: **Trigger follow-up actions or summaries using AI**

You’ll be able to use this to track:

- 
New sales leads from inbound emails

- 
Tasks sent by your team or clients

- 
Personal notes (like recipes or links you emailed yourself)

- 
Bookmarks or ideas you want to revisit later

### 🔄 How It Works (Step-by-Step)

- 
**Email Trigger**
Use the **IMAP Email node** in n8n. This connects to a Gmail inbox or any other inbox that supports IMAP. You can set filters like “only unread” or “only subject lines with `New Lead:`”.

- 
**Extract the Data**
Use **Set**, **HTML Extract**, or **Regex** nodes to isolate the key details—like the sender’s name, phone number, task name, or a link.

- 
**Send to Google Sheets**
Add the **Google Sheets node**, authenticate your account, and map each piece of data to its column. You can even send it to different sheets based on email type.

- 
**(Optional) Add AI**
Plug in an **OpenAI node** to summarize the email, classify the task, or clean up the formatting before sending to Sheets.

- 
**(Optional) Schedule a Summary**
Use a **Cron node** to run daily, gather new entries, and send yourself a digest email using the **Email node**.

### 🎥 Watch the Full Tutorial

I walk through this whole build visually in this video:

This is a great starter automation that shows you the power of n8n—and how easy it is to go from “I wish I didn’t have to…” to “done for me, every time.”

### 💡 Why This Matters

You don’t need to be a developer to build real automations.

n8n gives you the ability to connect the tools you already use—email, spreadsheets, AI—and build something useful in under 30 minutes.

This kind of workflow:

- 
Saves time

- 
Reduces errors

- 
Creates consistency

- 
Makes your team (or just your future self) happier

Subscribe for more tutorials like this. We’ll keep things focused on **real-world automations**, not abstract theory.

—
## Join

👉🏻 SubStack Details https://substack.com/@dailyaistudio

👉🏻 Training https://training.dailyai.studio/

👉🏻 Scrapegraphai - SUPPORT https://scrapegraphai.com/welcome?via=alfred

👉🏻 Clothing https://www.stitchfix.com/invite/zwkjpzn4xs?utm_campaign=InviteReferral&sod=w&som=c

👉🏻 Swag https://store.dailyai.studio/

#### **🎉 Below is the JSON to paste into your N8N**

```
{
  "nodes": [
    {
      "parameters": {
        "downloadAttachments": true,
        "options": {}
      },
      "type": "n8n-nodes-base.emailReadImap",
      "typeVersion": 2,
      "position": [
        -820,
        -280
      ],
      "id": "ca047e5b-5bd2-457c-8cbb-20deab21f445",
      "name": "Email Trigger (IMAP)",
      "credentials": {
        "imap": {
          "id": "07zrgCACJNPeozzF",
          "name": "Automation Example DailyAi"
        }
      }
    },
    {
      "parameters": {
        "options": {
          "systemMessage": "Your role is to be an assistant as data comes in, typically from email.  Just consider what to do with it, with all the tools you have below, including making tasks if there's a good reason to make a task, like a lead came in and we have to be reminded to follow up with it shortly.  There's also recipe tools and bookmark tools that you can use as well, just depends on what the message is that came in to you."
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.9,
      "position": [
        0,
        -200
      ],
      "id": "f05633d2-8ae8-43e8-8c73-d23a8027bdd1",
      "name": "AI Agent"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "1b3703a2-7b20-4cbe-9397-bcad65a8deb4",
              "name": "chatInput",
              "value": "={{ $json }}",
              "type": "string"
            },
            {
              "id": "3608fa24-2aa0-4c63-bbb1-4d8ef0a02f4e",
              "name": "sessionId",
              "value": "={{ $json.metadata['return-path'] }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -620,
        -280
      ],
      "id": "0c136f96-22f5-4b4a-a480-fe21de7d1db8",
      "name": "Edit Fields"
    },
    {
      "parameters": {},
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [
        -200,
        400
      ],
      "id": "337952ca-7fdb-4916-af35-15199dcd44ad",
      "name": "Simple Memory"
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "mode": "list",
          "value": "gpt-4o-mini"
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [
        -360,
        380
      ],
      "id": "f2c4fffa-e005-4dd0-83b5-6ff43efc66b9",
      "name": "OpenAI Chat Model",
      "credentials": {
        "openAiApi": {
          "id": "TqEEu0VRFjao8YS9",
          "name": "DailyMasterToken"
        }
      }
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "typeVersion": 1.1,
      "position": [
        -820,
        180
      ],
      "id": "36e58bf8-b4fe-4371-a792-4e67a9d253b9",
      "name": "When chat message received",
      "webhookId": "9e211b9e-de59-4ce7-8953-4c07278f4c12"
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Leads",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit#gid=0"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Name": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Name', ``, 'string') }}",
            "Email": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Email', ``, 'string') }}",
            "Phone": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Phone', ``, 'string') }}",
            "Date": "={{ $now.format('yyyy-MM-dd h:m a') }}",
            "Message": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Message', ``, 'string') }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "Name",
              "displayName": "Name",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Email",
              "displayName": "Email",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Phone",
              "displayName": "Phone",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Date",
              "displayName": "Date",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Message",
              "displayName": "Message",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheetsTool",
      "typeVersion": 4.6,
      "position": [
        100,
        480
      ],
      "id": "d20d08c8-98d2-41eb-a77c-89813ea6b45f",
      "name": "add_leads_to_sheets",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "rWb3copWsrXALz2Z",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Get Existing Leads to make sure it is not a duplicate",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Leads",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit#gid=0"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheetsTool",
      "typeVersion": 4.6,
      "position": [
        -40,
        440
      ],
      "id": "c8ba2a89-2b25-430e-8e30-25c78d668a27",
      "name": "get_existing_leads",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "rWb3copWsrXALz2Z",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "pollTimes": {
          "item": [
            {
              "mode": "everyMinute"
            }
          ]
        },
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Leads",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit#gid=0"
        },
        "event": "rowAdded",
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheetsTrigger",
      "typeVersion": 1,
      "position": [
        -680,
        760
      ],
      "id": "25709dcb-32e5-4da1-aca6-0afde5f9a25e",
      "name": "Google Sheets Trigger",
      "credentials": {
        "googleSheetsTriggerOAuth2Api": {
          "id": "0T3rvvmj24tUxn01",
          "name": "Google Sheets Trigger account"
        }
      }
    },
    {
      "parameters": {
        "channelId": "xdf1b3xoj7f35yj58guchp9zdr",
        "message": " New Lead (testing)",
        "attachments": [],
        "otherOptions": {}
      },
      "type": "n8n-nodes-base.mattermost",
      "typeVersion": 1,
      "position": [
        -460,
        760
      ],
      "id": "00198f55-c850-41d2-9a25-5e95ec995065",
      "name": "Mattermost",
      "credentials": {
        "mattermostApi": {
          "id": "AcMgrCqmCCmL2mZV",
          "name": "Mattermost account"
        }
      }
    },
    {
      "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Get Existing Tasks to make sure it is not a duplicate",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": 1139481038,
          "mode": "list",
          "cachedResultName": "Tasks",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit#gid=1139481038"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheetsTool",
      "typeVersion": 4.6,
      "position": [
        420,
        460
      ],
      "id": "43b793a1-1650-4e2c-81b7-a63adbc0b8d2",
      "name": "get_existing_tasks",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "rWb3copWsrXALz2Z",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Create a new Task",
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": 1139481038,
          "mode": "list",
          "cachedResultName": "Tasks",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit#gid=1139481038"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Item": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Item', ``, 'string') }}",
            "Notes": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Notes', ``, 'string') }}",
            "Related Lead": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Related_Lead', ``, 'string') }}",
            "Due Date": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Due_Date', ``, 'string') }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "Item",
              "displayName": "Item",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Notes",
              "displayName": "Notes",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Related Lead",
              "displayName": "Related Lead",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Due Date",
              "displayName": "Due Date",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheetsTool",
      "typeVersion": 4.6,
      "position": [
        260,
        460
      ],
      "id": "fdb327ad-f43b-46d4-8b9b-7b3baaef1ba4",
      "name": "add_tasks",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "rWb3copWsrXALz2Z",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Create a new Recipe from the URL",
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": 744417427,
          "mode": "list",
          "cachedResultName": "Recipes",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1xjp08Z7P9LGrIDYOQxSkhNUKCrORy_JoLRMdX1AKdyg/edit#gid=744417427"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Title": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Title', ``, 'string') }}",
            "URL": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('URL', ``, 'string') }}",
            "TLDR": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('TLDR', ``, 'string') }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "Title",
              "displayName": "Title",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "URL",
              "displayName": "URL",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "TLDR",
              "displayName": "TLDR",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheetsTool",
      "typeVersion": 4.6,
      "position": [
        580,
        440
      ],
      "id": "c40806b5-3236-4636-9e65-8df3321cefa6",
      "name": "add_recipe",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "rWb3copWsrXALz2Z",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "triggerAtHour": 6
            }
          ]
        }
      },
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [
        -820,
        -60
      ],
      "id": "7ea2ca8b-d0bc-4fc2-bd79-c323daaa49f9",
      "name": "Schedule Trigger"
    },
    {
      "parameters": {
        "fromEmail": "automations-example@dailyai.studio",
        "toEmail": "bob@dailyai.studio",
        "subject": "Your daliy update",
        "emailFormat": "text",
        "text": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Text', ``, 'string') }}",
        "options": {}
      },
      "type": "n8n-nodes-base.emailSendTool",
      "typeVersion": 2.1,
      "position": [
        600,
        140
      ],
      "id": "c426cc91-1b3a-4ef8-8716-fea7051965e9",
      "name": "Send Email",
      "webhookId": "5d1aa3cc-b1d6-40dc-87cb-8efc428c1ec6",
      "credentials": {
        "smtp": {
          "id": "kYuzndvwAyWQieUf",
          "name": "SMTP account"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "1b3703a2-7b20-4cbe-9397-bcad65a8deb4",
              "name": "chatInput",
              "value": "=Look for our todo items due today and leads that came in yesterday and anything else to give us our daily report using the SMTP tool to send it as an email.\n\nToday is {{ $now }}",
              "type": "string"
            },
            {
              "id": "3608fa24-2aa0-4c63-bbb1-4d8ef0a02f4e",
              "name": "sessionId",
              "value": "=daily_message",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -600,
        -60
      ],
      "id": "0629a43a-cea1-4d25-b0cf-7db1dff5f915",
      "name": "Edit Fields1"
    }
  ],
  "connections": {
    "Email Trigger (IMAP)": {
      "main": [
        [
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields": {
      "main": [
        [
          {
            "node": "AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Simple Memory": {
      "ai_memory": [
        [
          {
            "node": "AI Agent",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "When chat message received": {
      "main": [
        [
          {
            "node": "AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "add_leads_to_sheets": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "get_existing_leads": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets Trigger": {
      "main": [
        [
          {
            "node": "Mattermost",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "get_existing_tasks": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "add_tasks": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "add_recipe": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Edit Fields1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Email": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields1": {
      "main": [
        [
          {
            "node": "AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "Email Trigger (IMAP)": [
      {
        "textHtml": "",
        "textPlain": "Savory Lentil & Vegetable Stew\r\nA comforting and nutritious stew combining hearty lentils with a medley \r\nof seasonal vegetables for a filling, healthy, and easy-to-make meal.\r\n\r\nhttps://simplerecipes.io/recipes/51\r\n",
        "metadata": {
          "return-path": "<bob@dailyai.studio>",
          "delivered-to": "automations-example@dailyai.studio",
          "received": "from heracles.mxrouting.net\tby heracles.mxrouting.net with LMTP\tid gJRyN9a3XmjjIS4AB5j/qg\t(envelope-from <bob@dailyai.studio>)\tfor <automations-example@dailyai.studio>; Fri, 27 Jun 2025 15:25:10 +0000",
          "envelope-to": "automations-example@dailyai.studio",
          "delivery-date": "Fri, 27 Jun 2025 15:25:10 +0000",
          "x-spam-checker-version": "SpamAssassin 4.0.0 (2022-12-14) on\theracles.mxrouting.net",
          "x-spam-level": "",
          "x-spam-status": "No, score=-10.0 required=5.0 tests=ALL_TRUSTED\tautolearn=disabled version=4.0.0",
          "mime-version": "1.0",
          "message-id": "<e4397500258b42bccabba22fecd9f877@dailyai.studio>",
          "x-sender": "bob@dailyai.studio",
          "content-type": "text/plain; charset=US-ASCII; format=flowed",
          "content-transfer-encoding": "7bit"
        },
        "attributes": {
          "uid": 4
        },
        "date": "Fri, 27 Jun 2025 17:25:10 +0200",
        "from": "bob@dailyai.studio",
        "to": "automations-example@dailyai.studio",
        "subject": "Recipe save"
      }
    ]
  },
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "b77b374d91a001765a8bf2832badc1f8fcc5407c99c4c6f3f68d6413d663ef83"
  }
}
```
