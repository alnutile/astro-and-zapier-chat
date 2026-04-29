---
title: "Active Pieces as an MCP Server"
date: 2025-06-18
excerpt: "This will explain and have the files needed to make your own AP MCP Server"
image: "https://substackcdn.com/image/youtube/w_728,c_limit/O0KidS0Yb1Q"
tags: []
# original_url: https://substack.com/home/post/p-166274553
---

Here is the output on how it works and what to keep an eye on.

This is the step by stem on how it works: 

https://app.excalidraw.com/l/9rZJm2HlJOy/6LOO9HUH3ix

[

![](https://substackcdn.com/image/fetch/$s_!0bih!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcb089a46-d3f2-4ae7-b177-a033cc4c0efb_2082x2250.png)

](https://substackcdn.com/image/fetch/$s_!0bih!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcb089a46-d3f2-4ae7-b177-a033cc4c0efb_2082x2250.png)

Let me get the csv as well.

Your MCP should look like this

[

![CleanShot 2025-05-30 at 16.25.50@2x](https://substackcdn.com/image/fetch/$s_!5eOV!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe8576c6a-cf62-48b8-9dbc-064e78d72a49_638x500.png)

](https://substackcdn.com/image/fetch/$s_!5eOV!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe8576c6a-cf62-48b8-9dbc-064e78d72a49_638x500.png)

If you watch the video the rule really helped

[

![CleanShot 2025-05-30 at 16.26.46@2x](https://substackcdn.com/image/fetch/$s_!SG9Y!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9eef81ee-107e-478a-8ada-9619ec785df6_690x290.png)

](https://substackcdn.com/image/fetch/$s_!SG9Y!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9eef81ee-107e-478a-8ada-9619ec785df6_690x290.png)

The files are below

```
{
  "created": "1748636697130",
  "updated": "1748636697130",
  "name": "TicketSystem",
  "description": "",
  "tags": [],
  "pieces": [
    "@activepieces/piece-mcp",
    "@activepieces/piece-http"
  ],
  "template": {
    "displayName": "TicketSystem",
    "trigger": {
      "name": "trigger",
      "valid": true,
      "displayName": "MCP Tool",
      "type": "PIECE_TRIGGER",
      "settings": {
        "pieceName": "@activepieces/piece-mcp",
        "pieceVersion": "0.0.5",
        "pieceType": "OFFICIAL",
        "packageType": "REGISTRY",
        "input": {
          "toolName": "ticket_system",
          "inputSchema": [
            {
              "name": "name",
              "type": "Text",
              "required": true,
              "description": "The name of the ticket"
            },
            {
              "name": "description",
              "type": "Text",
              "required": true,
              "description": "Information about the ticket"
            }
          ],
          "returnsResponse": true,
          "toolDescription": "Add Ticket to our System"
        },
        "inputUiInfo": {
          "customizedInputs": {}
        },
        "triggerName": "mcp_tool"
      },
      "nextAction": {
        "name": "step_1",
        "skip": false,
        "type": "PIECE",
        "valid": true,
        "settings": {
          "input": {
            "url": "https://plane.dailyai.studio/api/v1/workspaces/dailyai/projects/4651d2f4-beb3-4051-8e26-1a97f8fcb625/issues/",
            "body": {
              "data": {
                "name": "{{trigger['name']}}",
                "description_html": "{{trigger['description']}}"
              }
            },
            "method": "POST",
            "headers": {
              "x-api-key": "plane_api_da1a0637a85d4c23bcbf8821f876fdf2"
            },
            "authType": "NONE",
            "failsafe": false,
            "body_type": "json",
            "use_proxy": false,
            "authFields": {},
            "queryParams": {},
            "proxy_settings": {}
          },
          "pieceName": "@activepieces/piece-http",
          "pieceType": "OFFICIAL",
          "actionName": "send_request",
          "inputUiInfo": {
            "schema": {
              "body": {
                "data": {
                  "type": "JSON",
                  "required": true,
                  "displayName": "JSON Body"
                }
              },
              "authFields": {},
              "proxy_settings": {}
            },
            "customizedInputs": {}
          },
          "packageType": "REGISTRY",
          "pieceVersion": "0.7.0",
          "errorHandlingOptions": {
            "retryOnFailure": {
              "value": false
            },
            "continueOnFailure": {
              "value": false
            }
          }
        },
        "displayName": "Send HTTP request"
      }
    },
    "valid": true,
    "connectionIds": [],
    "schemaVersion": "1"
  },
  "blogUrl": ""
}
```

```
{
  "created": "1748636699445",
  "updated": "1748636699445",
  "name": "DocsMcpClient",
  "description": "",
  "tags": [],
  "pieces": [
    "@activepieces/piece-mcp",
    "@activepieces/piece-tables"
  ],
  "template": {
    "displayName": "DocsMcpClient",
    "trigger": {
      "name": "trigger",
      "valid": true,
      "displayName": "MCP Tool",
      "type": "PIECE_TRIGGER",
      "settings": {
        "pieceName": "@activepieces/piece-mcp",
        "pieceVersion": "~0.0.5",
        "pieceType": "OFFICIAL",
        "packageType": "REGISTRY",
        "input": {
          "toolName": "docs",
          "inputSchema": [],
          "returnsResponse": true,
          "toolDescription": "These are the internal docs"
        },
        "inputUiInfo": {
          "customizedInputs": {}
        },
        "triggerName": "mcp_tool"
      },
      "nextAction": {
        "name": "step_1",
        "skip": false,
        "type": "PIECE",
        "valid": true,
        "settings": {
          "input": {
            "filters": {
              "filters": []
            },
            "table_id": "2FS1OaevzcZp36zLmO7c5"
          },
          "pieceName": "@activepieces/piece-tables",
          "pieceType": "OFFICIAL",
          "actionName": "tables-find-records",
          "inputUiInfo": {
            "schema": {
              "filters": {
                "filters": {
                  "type": "ARRAY",
                  "required": false,
                  "properties": {
                    "field": {
                      "type": "STATIC_DROPDOWN",
                      "options": {
                        "options": [
                          {
                            "label": "Title",
                            "value": {
                              "id": "ZZz0w4qj6JBsyipwfhGCm",
                              "name": "Title",
                              "type": "TEXT"
                            }
                          },
                          {
                            "label": "Content",
                            "value": {
                              "id": "XWb2yKyz23G7RT3gs7ROe",
                              "name": "Content",
                              "type": "TEXT"
                            }
                          }
                        ]
                      },
                      "required": true,
                      "displayName": "Field"
                    },
                    "value": {
                      "type": "SHORT_TEXT",
                      "required": true,
                      "displayName": "Value"
                    },
                    "operator": {
                      "type": "STATIC_DROPDOWN",
                      "options": {
                        "options": [
                          {
                            "label": "Equals",
                            "value": "eq"
                          },
                          {
                            "label": "Not Equals",
                            "value": "neq"
                          },
                          {
                            "label": "Greater Than",
                            "value": "gt"
                          },
                          {
                            "label": "Greater Than or Equal",
                            "value": "gte"
                          },
                          {
                            "label": "Less Than",
                            "value": "lt"
                          },
                          {
                            "label": "Less Than or Equal",
                            "value": "lte"
                          },
                          {
                            "label": "Contains",
                            "value": "co"
                          }
                        ]
                      },
                      "required": true,
                      "displayName": "Operator"
                    }
                  },
                  "displayName": "Filters"
                }
              }
            },
            "customizedInputs": {}
          },
          "packageType": "REGISTRY",
          "pieceVersion": "~0.0.6",
          "errorHandlingOptions": {
            "retryOnFailure": {
              "value": false
            },
            "continueOnFailure": {
              "value": false
            }
          }
        },
        "nextAction": {
          "name": "step_3",
          "skip": false,
          "type": "CODE",
          "valid": true,
          "settings": {
            "input": {
              "data": "{{step_1}}"
            },
            "sourceCode": {
              "code": "export const code = async (inputs) => {\n  const items = inputs.data;\n\n  const output = items\n    .map((item) => {\n      const title = item?.cells?.['ZZz0w4qj6JBsyipwfhGCm']?.value ?? '';\n      const content = item?.cells?.['XWb2yKyz23G7RT3gs7ROe']?.value ?? '';\n      return `## ${title}\\n\\n${content}`;\n    })\n    .join('\\n\\n---\\n\\n');\n\n  return { result: output };\n};",
              "packageJson": "{}"
            },
            "inputUiInfo": {
              "customizedInputs": {}
            },
            "errorHandlingOptions": {
              "retryOnFailure": {
                "value": false
              },
              "continueOnFailure": {
                "value": false
              }
            }
          },
          "nextAction": {
            "name": "step_2",
            "skip": false,
            "type": "PIECE",
            "valid": true,
            "settings": {
              "input": {
                "mode": "simple",
                "respond": "stop",
                "response": {
                  "response": {
                    "data": "{{step_3['result']}}"
                  }
                }
              },
              "pieceName": "@activepieces/piece-mcp",
              "pieceType": "OFFICIAL",
              "actionName": "reply_to_mcp_client",
              "inputUiInfo": {
                "schema": {
                  "response": {
                    "response": {
                      "type": "OBJECT",
                      "required": true,
                      "displayName": "Response"
                    }
                  }
                },
                "customizedInputs": {}
              },
              "packageType": "REGISTRY",
              "pieceVersion": "~0.0.5",
              "errorHandlingOptions": {
                "retryOnFailure": {
                  "value": false
                },
                "continueOnFailure": {
                  "value": false
                }
              }
            },
            "displayName": "Reply to MCP Client"
          },
          "displayName": "Custom Javascript Code"
        },
        "displayName": "Find Records"
      }
    },
    "valid": true,
    "connectionIds": [],
    "schemaVersion": "1"
  },
  "blogUrl": ""
}
```

CSV for the table https://docs.google.com/spreadsheets/d/1fP7mmPrkMPzh8mjHoYjmGnnr0JUTPvG6VNjHE29iMxg/edit?usp=drive_link
