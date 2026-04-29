---
title: "Automate RAG QA"
date: 2025-06-18
excerpt: "This is what I am using now to test the results of the RAG systems I am building and help improve them."
image: "https://substackcdn.com/image/youtube/w_728,c_limit/ayCd68iJUBI"
tags: []
# original_url: https://substack.com/home/post/p-166272923
---

This is really a good way to save time and automate testing the quality of your RAG output to help you tweak it and make it better.

The JSON is below
```
{
  "name": "rag-qa",
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        -220,
        760
      ],
      "id": "f91957c7-f28e-4815-9276-4e125a8914ac",
      "name": "When clicking ‘Test workflow’"
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
          "value": "pre_rag_content",
          "mode": "list",
          "cachedResultName": "pre_rag_content"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        200,
        580
      ],
      "id": "c43421d8-8ee0-4a99-a561-9561a8b18574",
      "name": "Postgres",
      "credentials": {
        "postgres": {
          "id": "UtnpjTy78dpA6cRH",
          "name": "IdeasPostgres"
        }
      }
    },
    {
      "parameters": {
        "content": "## Generate the Questions\nHere we use 100 rows of the data to make about 10 questions to test against\nDo not change these till after you are happy with the results \n",
        "height": 240,
        "width": 760
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        20,
        260
      ],
      "typeVersion": 1,
      "id": "dfa05b84-a2c0-4521-b892-1f0846c44c58",
      "name": "Sticky Note"
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-4.1",
          "mode": "list",
          "cachedResultName": "GPT-4.1"
        },
        "messages": {
          "values": [
            {
              "content": "={{ $json.content }}"
            },
            {
              "content": "Your role is to help me analyze or QA a RAG system. This is the data before being vectorized And I just want you to generate three questions out of this data so then we can ask the RAG system and see how the results are.  So you'll give me, sorry, 10 questions and you'll give me 10 potential answers that would be good answers. So that's 10 questions. Each question will have an example answer and that's it. And I'm going to save that after.\n\nTreat it as if you are a user of this system trying to learn the ins and outs of pickelball\n\nOutput will be\n{\n  \"questions\": [\n  {\n   \"question\": \"Some question here\",\n   \"answer\": \"Some good answer so we can us it to compare later\"\n  }\n]\n}\n\n\n",
              "role": "system"
            }
          ]
        },
        "jsonOutput": true,
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.8,
      "position": [
        540,
        580
      ],
      "id": "7950bb29-1956-4966-ac53-87f347e446ec",
      "name": "OpenAI",
      "credentials": {
        "openAiApi": {
          "id": "v5lKgV7PDt0H77GQ",
          "name": "Toolbot Token"
        }
      }
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1h-vvjc_b_D5vxzKk-UoFeKVFnx09lWfRgUH-4T8gNrM/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "round1_test_questions",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1h-vvjc_b_D5vxzKk-UoFeKVFnx09lWfRgUH-4T8gNrM/edit#gid=0"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Question": "={{ $json.question }}",
            "Answer": "={{ $json.answer }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "Question",
              "displayName": "Question",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Answer",
              "displayName": "Answer",
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
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        1480,
        660
      ],
      "id": "34a6805b-f1c5-4c5f-bec8-2f388420fb1c",
      "name": "Google Sheets",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "rWb3copWsrXALz2Z",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        1180,
        580
      ],
      "id": "dbee681d-13b3-4608-8a23-aa86f678678d",
      "name": "Loop Over Items"
    },
    {
      "parameters": {
        "content": "## Run Tests \nTweakth prompt https://n8n-twi.apps.thedailyaistudio.com/workflow/C3svgTT4bGZDWcmQ",
        "height": 120,
        "width": 760
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        40,
        920
      ],
      "typeVersion": 1,
      "id": "150c36d9-7cf9-4fb0-b63a-4e70402fd645",
      "name": "Sticky Note1"
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/15uJD15ymZeKOna5JevrMvMEshPcUDf_QC-dL3anST6M/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": 61572501,
          "mode": "list",
          "cachedResultName": "round1_test_questions",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/15uJD15ymZeKOna5JevrMvMEshPcUDf_QC-dL3anST6M/edit#gid=61572501"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        60,
        1320
      ],
      "id": "93c5295f-5b1e-4dd0-8222-df891fe21ec8",
      "name": "Google Sheets1",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "rWb3copWsrXALz2Z",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        260,
        1320
      ],
      "id": "5a5ccb20-c965-4f54-829f-b14edffbe109",
      "name": "Loop Over Items1"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://n8n-twi.apps.thedailyaistudio.com/webhook/e985d15f-b2f6-456d-be15-97e0b1544a40/chat",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "action",
              "value": "sendMessage"
            },
            {
              "name": "sessionId",
              "value": "={{ $json.data }}"
            },
            {
              "name": "chatInput",
              "value": "={{ $json.Question }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        700,
        1420
      ],
      "id": "b3c77e6d-531a-459f-a816-25c2271c70c2",
      "name": "HTTP Request"
    },
    {
      "parameters": {
        "action": "generate"
      },
      "type": "n8n-nodes-base.crypto",
      "typeVersion": 1,
      "position": [
        480,
        1420
      ],
      "id": "f7ee3edc-6078-463b-bc9b-5dab5debd79e",
      "name": "Crypto"
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "o3",
          "mode": "list",
          "cachedResultName": "O3"
        },
        "messages": {
          "values": [
            {
              "content": "={{ $json.output }}"
            },
            {
              "content": "=And these are questions and answers that our RAG system is giving. In a previous run, you gave us some questions and asks that should deliver some answers. \n\nSo now we are passing one question at a time to the rag system and getting results here for you to review.\n\nSo I've included below the question and the answer you thought would be a good answer and then what it gave.  I've also included below some of the data that we got the answers from, but there is so much data in the system, it could have found other data. So this isn't totally fair.  \n\nBut we're really looking for the right data, the right answer from the RAG system and then rate it one to five, five being the highest and then why.  So this is the first question.  So let's say, let's say, we are the first ones with this.  There we go.  We're looking for the data we're getting.  This is a really, really nice.  So this is one of the things that we are looking for today.  So we got a plan of the data.  So, let's go.\n\n\n\n## OUTPUT\nOutput will be\n{\n   \"answer\": \"Some good answer so we can us it to compare later\",\n   \"rating\": 1 to 5,\n   \"reason\": \"Reason for the ratings\"   \n  }\n\n\n## ORIGINAL QUESTION\n{{ $('Crypto').item.json.Question }}\n\n## ORIGINAL SUGGESTED ANSWER\n{{ $('Crypto').item.json.Answer }}\n\n## SOME OF THE SOURCE DATA\n{{ $('Postgres1').first().json.content }}\n",
              "role": "system"
            }
          ]
        },
        "jsonOutput": true,
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.8,
      "position": [
        940,
        1420
      ],
      "id": "20d354b7-8dac-4ff1-bbbe-6caa77a31317",
      "name": "OpenAI1",
      "credentials": {
        "openAiApi": {
          "id": "v5lKgV7PDt0H77GQ",
          "name": "Toolbot Token"
        }
      }
    },
    {
      "parameters": {
        "fieldToSplitOut": "message.content.questions",
        "options": {}
      },
      "type": "n8n-nodes-base.splitOut",
      "typeVersion": 1,
      "position": [
        920,
        580
      ],
      "id": "31d8e302-9ea0-430a-acfb-d3b205e4b1cc",
      "name": "Split Out"
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
          "value": "pre_rag_content",
          "mode": "list",
          "cachedResultName": "pre_rag_content"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -20,
        1100
      ],
      "id": "139a15f5-3d54-4d73-a652-537555e73682",
      "name": "Postgres1",
      "credentials": {
        "postgres": {
          "id": "UtnpjTy78dpA6cRH",
          "name": "IdeasPostgres"
        }
      }
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1h-vvjc_b_D5vxzKk-UoFeKVFnx09lWfRgUH-4T8gNrM/edit?usp=sharing",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": 1664388805,
          "mode": "list",
          "cachedResultName": "round",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/15uJD15ymZeKOna5JevrMvMEshPcUDf_QC-dL3anST6M/edit#gid=1664388805"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Question": "={{ $('Crypto').item.json.Question }}",
            "Reason": "={{ $json.message.content.reason }}",
            "Rating1-5": "={{ $json.message.content.rating }}",
            "Answer": "={{ $json.message.content.answer }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "Question",
              "displayName": "Question",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Answer",
              "displayName": "Answer",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Rating1-5",
              "displayName": "Rating1-5",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Reason",
              "displayName": "Reason",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "context",
              "displayName": "context",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        1300,
        1460
      ],
      "id": "044c689f-2766-40b9-b1a9-aad12d226c77",
      "name": "Google Sheets2",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "rWb3copWsrXALz2Z",
          "name": "Google Sheets account 2"
        }
      }
    }
  ],
  "pinData": {},
  "connections": {
    "When clicking ‘Test workflow’": {
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
    "Postgres": {
      "main": [
        [
          {
            "node": "OpenAI",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI": {
      "main": [
        [
          {
            "node": "Split Out",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets": {
      "main": [
        [
          {
            "node": "Loop Over Items",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Over Items": {
      "main": [
        [],
        [
          {
            "node": "Google Sheets",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets1": {
      "main": [
        [
          {
            "node": "Loop Over Items1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Over Items1": {
      "main": [
        [],
        [
          {
            "node": "Crypto",
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
            "node": "OpenAI1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Crypto": {
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
    "OpenAI1": {
      "main": [
        [
          {
            "node": "Google Sheets2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split Out": {
      "main": [
        [
          {
            "node": "Loop Over Items",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Postgres1": {
      "main": [
        [
          {
            "node": "Google Sheets1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets2": {
      "main": [
        [
          {
            "node": "Loop Over Items1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "1bd38d97-8efb-4cf4-a82f-98a42e207823",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "b77b374d91a001765a8bf2832badc1f8fcc5407c99c4c6f3f68d6413d663ef83"
  },
  "id": "jdGlvWaFK3nSqqLp",
  "tags": []
}
```
