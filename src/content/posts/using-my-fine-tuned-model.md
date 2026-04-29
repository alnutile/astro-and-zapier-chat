---
title: "Using my Fine Tuned Model"
date: 2025-06-21
excerpt: "In this video, I’ll show you how I use my fine-tuned voice model to automate content creation. After recording a video, I transcribe it and paste the text into a form, which triggers a process that ge"
image: "https://substackcdn.com/image/youtube/w_728,c_limit/w_r8B4hnI7c"
tags: []
# original_url: https://substack.com/home/post/p-166273281
---

The video is here 

The json is below

```
{
  "nodes": [
    {
      "parameters": {
        "model": "ft:gpt-4o-mini-2024-07-18:sundancesolutionsllc::BB0PQgUv",
        "options": {
          "maxTokens": 16384,
          "responseFormat": "text",
          "temperature": 0.3,
          "maxRetries": 5
        }
      },
      "id": "ca5fb083-fc7f-4ad3-8edb-935ff19d29c1",
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1,
      "position": [
        -300,
        80
      ],
      "credentials": {
        "openAiApi": {
          "id": "HpvrXscUWtB5V0Lc",
          "name": "DailyAiTraining"
        }
      }
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.message.content.description }}",
        "options": {
          "systemMessage": "=Your role is to take the incoming description and using the model that is a part of your system to kind of convert it to the voice or the phrase or the writing style of the author. By the time you're done it should be very complete, not short, two or three paragraphs, really giving the reader a sense of what the YouTube video is going to be about from start to end."
        }
      },
      "id": "85bca8ab-9c9c-43c5-9ffa-3dc716e34228",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.6,
      "position": [
        -220,
        -260
      ]
    },
    {
      "parameters": {
        "operation": "update",
        "documentURL": "https://docs.google.com/document/d/1SQe92R1F7X2Yhcwigcns10oycShToKWsax6_9hX5NoA/edit?tab=t.0",
        "actionsUi": {
          "actionFields": [
            {
              "action": "insert",
              "text": "=## Title {{ $('OpenAI').item.json.message.content.title }}\n\n## Description\n{{ $json.output }}\n\n## Links\n{{ $('OpenAI').item.json.message.content.join_links }}\n{{ $('OpenAI').item.json.message.content.links }}\n\n## Chapters\n{{ $('OpenAI').item.json.message.content.chapters }}\n\n\n## Tweet\n{{ $json.output }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.googleDocs",
      "typeVersion": 2,
      "position": [
        240,
        -40
      ],
      "id": "a3ba4496-ac84-4da4-a35a-696d70ef7c84",
      "name": "Google Docs",
      "credentials": {
        "googleDocsOAuth2Api": {
          "id": "G8IOp6tBBiFwVGgo",
          "name": "Google Docs account"
        }
      }
    },
    {
      "parameters": {
        "operation": "get",
        "documentURL": "https://docs.google.com/document/d/1SQe92R1F7X2Yhcwigcns10oycShToKWsax6_9hX5NoA/edit?tab=t.0"
      },
      "type": "n8n-nodes-base.googleDocs",
      "typeVersion": 2,
      "position": [
        -800,
        -260
      ],
      "id": "942a439b-a08b-4582-926f-8b54d2363ed1",
      "name": "Google Docs1",
      "credentials": {
        "googleDocsOAuth2Api": {
          "id": "G8IOp6tBBiFwVGgo",
          "name": "Google Docs account"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "documentURL": "https://docs.google.com/document/d/1SQe92R1F7X2Yhcwigcns10oycShToKWsax6_9hX5NoA/edit?tab=t.0",
        "actionsUi": {
          "actionFields": [
            {
              "action": "replaceAll",
              "text": "={{ $json.content }}",
              "replaceText": "\"\""
            }
          ]
        }
      },
      "type": "n8n-nodes-base.googleDocs",
      "typeVersion": 2,
      "position": [
        -800,
        -20
      ],
      "id": "1c2276f3-fd90-4999-8425-0da75a10d0b4",
      "name": "Google Docs2",
      "credentials": {
        "googleDocsOAuth2Api": {
          "id": "G8IOp6tBBiFwVGgo",
          "name": "Google Docs account"
        }
      }
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-4o",
          "mode": "list",
          "cachedResultName": "GPT-4O"
        },
        "messages": {
          "values": [
            {
              "content": "={{ $('Input').item.json.content }}"
            },
            {
              "content": "=## Date: {{ $now }}\n\n## ROLE\n\nYour role is to take the incoming transcript from YouTube and format it into the format seen below. Taking the content of the video and making a nice description out of it for YouTube.\nPlease 5 complelling titles we can choose from\n\n## Format: \n{\n  \"title\": [\n    \"<string>\",\n    \"<string>\"\n  ],\n  \"description\": \"what you make out of the transcripts\",\n  \"join_links\": \"As seen below\",\n  \"links\": \"any links in the video\",\n  \"chapters\": \"line by line with time,\n  \"tweet\": \"The right size for this\"\n}\n\n\n## Example in non json below\nTITLE 1\nTITLE 2\nTITLE 3\n\n<add some youtube tags here from this list>\n#n8n #supabase #rls #nocode #lovable #cursor #locode #coolify #nextjs\n\n\nDescription here\n\n## Join\n👉🏻 Forum Sign Details https://training.dailyai.studio/\n👉🏻 NewsLetter https://signup.dailyai.studio/\n👉🏻 Training https://training.dailyai.studio/\n👉🏻 Scrapegraphai - SUPPORT https://scrapegraphai.com/welcome?via=alfred\n👉🏻 Clothing https://www.stitchfix.com/invite/zwkjpzn4xs?utm_campaign=InviteReferral&sod=w&som=c\n👉🏻 Swag https://store.dailyai.studio/\n\n\n\n## Links\nIf any in the video then put them here \n\n## Chapters\n[02:33] Chapter Name\n[02:33] Chapter Name\n[02:33] Chapter Name\n[02:33] Chapter Name\n",
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
        -560,
        -260
      ],
      "id": "cbaaf1ab-e5df-4569-957c-5579661270bc",
      "name": "OpenAI",
      "credentials": {
        "openAiApi": {
          "id": "HpvrXscUWtB5V0Lc",
          "name": "DailyAiTraining"
        }
      }
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.output }}",
        "options": {
          "systemMessage": "=Your role is to take the incoming tweet and rewrite it so it sounds like the author which the model you are using was fine tuned with his writing styles. Keep it short so I can use it in bluesky too, one to two sentences tops\n\n\nMAKE SURE IT IS SHORT HAS TO FIT BLUESKY AND TWITTER"
        }
      },
      "id": "df6356b4-eb4c-4168-8e79-81b0e93ef350",
      "name": "TweetAgent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.6,
      "position": [
        -80,
        -20
      ]
    },
    {
      "parameters": {
        "content": "## Input Output\n\nPut Transcript here\nhttps://docs.google.com/document/d/1E2VADcdj0Q9MoSmzYwOcn1CjfJC5sNeyFRNz5LePAgk/edit?tab=t.0\n\nOut is here\nhttps://docs.google.com/document/d/1SQe92R1F7X2Yhcwigcns10oycShToKWsax6_9hX5NoA/edit?tab=t.0",
        "height": 260,
        "width": 900
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        -1160,
        -580
      ],
      "typeVersion": 1,
      "id": "c27e0546-403b-4b42-9bdb-39bfcc897eb3",
      "name": "Sticky Note"
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        -1140,
        -260
      ],
      "id": "47dc14fa-6843-4a72-8928-6971743d8625",
      "name": "When clicking ‘Test workflow’"
    },
    {
      "parameters": {
        "operation": "get",
        "documentURL": "https://docs.google.com/document/d/1E2VADcdj0Q9MoSmzYwOcn1CjfJC5sNeyFRNz5LePAgk/edit?tab=t.0"
      },
      "type": "n8n-nodes-base.googleDocs",
      "typeVersion": 2,
      "position": [
        -960,
        -260
      ],
      "id": "56ef6d89-f050-4fda-a348-611b42bd5643",
      "name": "Input",
      "credentials": {
        "googleDocsOAuth2Api": {
          "id": "G8IOp6tBBiFwVGgo",
          "name": "Google Docs account"
        }
      }
    },
    {
      "parameters": {
        "resource": "image",
        "model": "=gpt-image-1",
        "prompt": "=## JUST WORDS NO PEOPLE I WILL PUT MYSELF IN AFTER\nMake a nice modern looking Youtube size image I can use for my video Thumbnail\n\n\n{{ $('TweetAgent').item.json.output }}",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.8,
      "position": [
        400,
        160
      ],
      "id": "7879ef78-24ce-4045-9773-32174b043877",
      "name": "OpenAI1",
      "credentials": {
        "openAiApi": {
          "id": "TqEEu0VRFjao8YS9",
          "name": "DailyMasterToken"
        }
      }
    },
    {
      "parameters": {
        "content": "## Update to 1.91 to get this"
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        520,
        -340
      ],
      "typeVersion": 1,
      "id": "900cafc9-a3ce-448e-8fe9-b310bfa0f8be",
      "name": "Sticky Note1"
    }
  ],
  "connections": {
    "OpenAI Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "TweetAgent",
            "type": "ai_languageModel",
            "index": 0
          },
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent": {
      "main": [
        [
          {
            "node": "TweetAgent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Docs": {
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
    "Google Docs1": {
      "main": [
        [
          {
            "node": "Google Docs2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Docs2": {
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
            "node": "AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "TweetAgent": {
      "main": [
        [
          {
            "node": "Google Docs",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "When clicking ‘Test workflow’": {
      "main": [
        [
          {
            "node": "Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Input": {
      "main": [
        [
          {
            "node": "Google Docs1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "When clicking ‘Test workflow’": [
      {}
    ]
  },
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "b77b374d91a001765a8bf2832badc1f8fcc5407c99c4c6f3f68d6413d663ef83"
  }
}
```
