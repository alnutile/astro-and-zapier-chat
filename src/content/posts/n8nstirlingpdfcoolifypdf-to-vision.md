---
title: "🚀N8N+StirlingPDF+Coolify=PDF to Vision Ai or the VitorPipeline"
date: 2025-06-18
excerpt: "This is a really really good one since this pipeline that someone I work with made up uses Stirling PDF to do all the heavy lifting then takes the PDF to Images and we pass it to Vision ai to get more"
image: "https://substackcdn.com/image/fetch/$s_!7wo0!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fac99e7cb-8fe9-42eb-96d1-79d9c53d4c31_2538x1750.png"
tags: []
# original_url: https://substack.com/home/post/p-166272692
---

The video is here 

You can get the JSON below

\n    
\n      
\n        
\n  
\n    \n    
\n\n        \n
\n\n  \n  
\n  \n    \n\n    
\n      This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.\n      Learn more about bidirectional Unicode characters\n    
\n\n\n  
            Show hidden characters\n\n
\n
\n\n  
\n    \n    \n\n
\n\n  \n        \n          \n          {\n        \n        \n          \n            
"name"
: 

"
My workflow
"

,\n        \n        \n          \n            
"nodes"
: [\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"method"
: 

"
POST
"

,\n        \n        \n          \n                  
"url"
: 

"
https://spdf-wk8skow8s4okw0084c40o44w.apps.thedailyaistudio.com/api/v1/convert/pdf/img
"

,\n        \n        \n          \n                  
"sendHeaders"
: 
true
,\n        \n        \n          \n                  
"headerParameters"
: {\n        \n        \n          \n                    
"parameters"
: [\n        \n        \n          \n                      {\n        \n        \n          \n                        
"name"
: 

"
accept
"

,\n        \n        \n          \n                        
"value"
: 

"
*/*
"

\n        \n        \n          \n                      }\n        \n        \n          \n                    ]\n        \n        \n          \n                  },\n        \n        \n          \n                  
"sendBody"
: 
true
,\n        \n        \n          \n                  
"contentType"
: 

"
multipart-form-data
"

,\n        \n        \n          \n                  
"bodyParameters"
: {\n        \n        \n          \n                    
"parameters"
: [\n        \n        \n          \n                      {\n        \n        \n          \n                        
"name"
: 

"
imageFormat
"

,\n        \n        \n          \n                        
"value"
: 

"
png
"

\n        \n        \n          \n                      },\n        \n        \n          \n                      {\n        \n        \n          \n                        
"name"
: 

"
singleOrMultiple
"

,\n        \n        \n          \n                        
"value"
: 

"
multiple
"

\n        \n        \n          \n                      },\n        \n        \n          \n                      {\n        \n        \n          \n                        
"name"
: 

"
colorType
"

,\n        \n        \n          \n                        
"value"
: 

"
color
"

\n        \n        \n          \n                      },\n        \n        \n          \n                      {\n        \n        \n          \n                        
"name"
: 

"
dpi
"

,\n        \n        \n          \n                        
"value"
: 

"
300
"

\n        \n        \n          \n                      },\n        \n        \n          \n                      {\n        \n        \n          \n                        
"parameterType"
: 

"
formBinaryData
"

,\n        \n        \n          \n                        
"name"
: 

"
fileInput
"

,\n        \n        \n          \n                        
"inputDataFieldName"
: 

"
Document
"

\n        \n        \n          \n                      },\n        \n        \n          \n                      {\n        \n        \n          \n                        
"name"
: 

"
pageNumbers
"

,\n        \n        \n          \n                        
"value"
: 

"
all
"

\n        \n        \n          \n                      }\n        \n        \n          \n                    ]\n        \n        \n          \n                  },\n        \n        \n          \n                  
"options"
: {\n        \n        \n          \n                    
"redirect"
: {\n        \n        \n          \n                      
"redirect"
: {\n        \n        \n          \n                        
"followRedirects"
: 
true
,\n        \n        \n          \n                        
"maxRedirects"
: 
21
\n        \n        \n          \n                      }\n        \n        \n          \n                    },\n        \n        \n          \n                    
"response"
: {}\n        \n        \n          \n                  }\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.httpRequest
"

,\n        \n        \n          \n                
"typeVersion"
: 
4.2
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
180
,\n        \n        \n          \n                  
0
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
fffda37f-9cbb-4c43-a3f9-6713aeb03447
"

,\n        \n        \n          \n                
"name"
: 

"
HTTP Request
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {},\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.compression
"

,\n        \n        \n          \n                
"typeVersion"
: 
1.1
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
180
,\n        \n        \n          \n                  
520
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
3030f096-aeb4-41bd-b025-c92b7ee53db3
"

,\n        \n        \n          \n                
"name"
: 

"
Compression
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"operation"
: 

"
write
"

,\n        \n        \n          \n                  
"fileName"
: 

"
/tmp/test.zip
"

,\n        \n        \n          \n                  
"options"
: {}\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.readWriteFile
"

,\n        \n        \n          \n                
"typeVersion"
: 
1
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
180
,\n        \n        \n          \n                  
260
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
5e167523-9b7b-43a8-abaa-4cfb8bfe3d7f
"

,\n        \n        \n          \n                
"name"
: 

"
Read/Write Files from Disk
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"fileSelector"
: 

"
/tmp/test.zip
"

,\n        \n        \n          \n                  
"options"
: {}\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.readWriteFile
"

,\n        \n        \n          \n                
"typeVersion"
: 
1
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
360
,\n        \n        \n          \n                  
260
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
df7b0786-5cdb-4e18-9545-68cae24068fd
"

,\n        \n        \n          \n                
"name"
: 

"
Read/Write Files from Disk1
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"resource"
: 

"
image
"

,\n        \n        \n          \n                  
"operation"
: 

"
analyze
"

,\n        \n        \n          \n                  
"modelId"
: {\n        \n        \n          \n                    
"__rl"
: 
true
,\n        \n        \n          \n                    
"value"
: 

"
gpt-4o
"

,\n        \n        \n          \n                    
"mode"
: 

"
list
"

,\n        \n        \n          \n                    
"cachedResultName"
: 

"
GPT-4O
"

\n        \n        \n          \n                  },\n        \n        \n          \n                  
"text"
: 

"
Can you return ocr and also information about charts and data in the image so we can get a clear snse of what is in the PDF pages we turned into images
"

,\n        \n        \n          \n                  
"inputType"
: 

"
base64
"

,\n        \n        \n          \n                  
"options"
: {}\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
@n8n/n8n-nodes-langchain.openAi
"

,\n        \n        \n          \n                
"typeVersion"
: 
1.8
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
920
,\n        \n        \n          \n                  
560
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
acda1fcc-68c3-45f5-b67e-d61444b03999
"

,\n        \n        \n          \n                
"name"
: 

"
OpenAI1
"

,\n        \n        \n          \n                
"credentials"
: {\n        \n        \n          \n                  
"openAiApi"
: {\n        \n        \n          \n                    
"id"
: 

"
I7RAbk2vtoz2FIGj
"

,\n        \n        \n          \n                    
"name"
: 

"
OpenAi account
"

\n        \n        \n          \n                  }\n        \n        \n          \n                }\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"content"
: 

"
## Do what you want with the data coming out of the loop
"

\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.stickyNote
"

,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
600
,\n        \n        \n          \n                  
320
\n        \n        \n          \n                ],\n        \n        \n          \n                
"typeVersion"
: 
1
,\n        \n        \n          \n                
"id"
: 

"
18395ecf-faee-4822-ba43-494664ad7623
"

,\n        \n        \n          \n                
"name"
: 

"
Sticky Note
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"options"
: {}\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.splitInBatches
"

,\n        \n        \n          \n                
"typeVersion"
: 
3
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
620
,\n        \n        \n          \n                  
520
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
1e2bbd75-c905-465f-bb19-36bd90b695c2
"

,\n        \n        \n          \n                
"name"
: 

"
Loop Over Items
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"jsCode"
: 

"
let results = [];
\\n\\n
for (item of items) {
\\n
    for (key of Object.keys(item.binary)) {
\\n
        results.push({
\\n
            json: {
\\n
                fileName: item.binary[key].fileName
\\n
            },
\\n
            binary: {
\\n
                data: item.binary[key],
\\n
            }
\\n
        });
\\n
    }
\\n
}
\\n\\n
return results;
"

\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.code
"

,\n        \n        \n          \n                
"typeVersion"
: 
2
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
400
,\n        \n        \n          \n                  
520
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
0c3694bb-54ff-41d8-9f7f-0dd8173de8da
"

,\n        \n        \n          \n                
"name"
: 

"
List
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {},\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.noOp
"

,\n        \n        \n          \n                
"typeVersion"
: 
1
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
920
,\n        \n        \n          \n                  
400
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
8273ebf0-0d8f-4815-b10b-a1698305a739
"

,\n        \n        \n          \n                
"name"
: 

"
No Operation, do nothing
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"content"
: 

"
## Stirling PDF to Vision
\\n\\n\\n
### Docs
\\n
[here](https://spdf-wk8skow8s4okw0084c40o44w.apps.thedailyaistudio.com/?lang=en_US)
\\n\\n
## Swagger
\\n
[swagger](https://spdf-wk8skow8s4okw0084c40o44w.apps.thedailyaistudio.com/swagger-ui/index.html)
"

,\n        \n        \n          \n                  
"height"
: 
240
,\n        \n        \n          \n                  
"width"
: 
700
\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.stickyNote
"

,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
400
,\n        \n        \n          \n                  
-40
\n        \n        \n          \n                ],\n        \n        \n          \n                
"typeVersion"
: 
1
,\n        \n        \n          \n                
"id"
: 

"
5ae8d5af-be7b-41df-b6d4-51922abec846
"

,\n        \n        \n          \n                
"name"
: 

"
Sticky Note1
"

\n        \n        \n          \n              },\n        \n        \n          \n              {\n        \n        \n          \n                
"parameters"
: {\n        \n        \n          \n                  
"formTitle"
: 

"
Upload PDF
"

,\n        \n        \n          \n                  
"formDescription"
: 

"
Upload a PDF for Vision Review
"

,\n        \n        \n          \n                  
"formFields"
: {\n        \n        \n          \n                    
"values"
: [\n        \n        \n          \n                      {\n        \n        \n          \n                        
"fieldLabel"
: 

"
Document
"

,\n        \n        \n          \n                        
"fieldType"
: 

"
file
"

,\n        \n        \n          \n                        
"multipleFiles"
: 
false
,\n        \n        \n          \n                        
"acceptFileTypes"
: 

"
.pdf
"

,\n        \n        \n          \n                        
"requiredField"
: 
true
\n        \n        \n          \n                      }\n        \n        \n          \n                    ]\n        \n        \n          \n                  },\n        \n        \n          \n                  
"options"
: {}\n        \n        \n          \n                },\n        \n        \n          \n                
"type"
: 

"
n8n-nodes-base.formTrigger
"

,\n        \n        \n          \n                
"typeVersion"
: 
2.2
,\n        \n        \n          \n                
"position"
: [\n        \n        \n          \n                  
-220
,\n        \n        \n          \n                  
40
\n        \n        \n          \n                ],\n        \n        \n          \n                
"id"
: 

"
9cdf3073-6f1b-4287-a7b4-8dc488cf43b6
"

,\n        \n        \n          \n                
"name"
: 

"
On form submission
"

,\n        \n        \n          \n                
"webhookId"
: 

"
7d077ce1-8ec7-401b-9605-ec838c24f3e6
"

\n        \n        \n          \n              }\n        \n        \n          \n            ],\n        \n        \n          \n            
"pinData"
: {\n        \n        \n          \n              
"On form submission"
: [\n        \n        \n          \n                {\n        \n        \n          \n                  
"json"
: {\n        \n        \n          \n                    
"Document"
: {\n        \n        \n          \n                      
"filename"
: 

"
pickleball_facts_2023.pdf
"

,\n        \n        \n          \n                      
"mimetype"
: 

"
application/pdf
"

,\n        \n        \n          \n                      
"size"
: 
30446
\n        \n        \n          \n                    },\n        \n        \n          \n                    
"submittedAt"
: 

"
2025-04-30T22:48:49.254+02:00
"

,\n        \n        \n          \n                    
"formMode"
: 

"
production
"

\n        \n        \n          \n                  }\n        \n        \n          \n                }\n        \n        \n          \n              ]\n        \n        \n          \n            },\n        \n        \n          \n            
"connections"
: {\n        \n        \n          \n              
"HTTP Request"
: {\n        \n        \n          \n                
"main"
: [\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
Read/Write Files from Disk
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ]\n        \n        \n          \n                ]\n        \n        \n          \n              },\n        \n        \n          \n              
"Compression"
: {\n        \n        \n          \n                
"main"
: [\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
List
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ]\n        \n        \n          \n                ]\n        \n        \n          \n              },\n        \n        \n          \n              
"Read/Write Files from Disk"
: {\n        \n        \n          \n                
"main"
: [\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
Read/Write Files from Disk1
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ]\n        \n        \n          \n                ]\n        \n        \n          \n              },\n        \n        \n          \n              
"Read/Write Files from Disk1"
: {\n        \n        \n          \n                
"main"
: [\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
Compression
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ]\n        \n        \n          \n                ]\n        \n        \n          \n              },\n        \n        \n          \n              
"OpenAI1"
: {\n        \n        \n          \n                
"main"
: [\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
Loop Over Items
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ]\n        \n        \n          \n                ]\n        \n        \n          \n              },\n        \n        \n          \n              
"Loop Over Items"
: {\n        \n        \n          \n                
"main"
: [\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
No Operation, do nothing
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ],\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
OpenAI1
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ]\n        \n        \n          \n                ]\n        \n        \n          \n              },\n        \n        \n          \n              
"List"
: {\n        \n        \n          \n                
"main"
: [\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
Loop Over Items
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ]\n        \n        \n          \n                ]\n        \n        \n          \n              },\n        \n        \n          \n              
"On form submission"
: {\n        \n        \n          \n                
"main"
: [\n        \n        \n          \n                  [\n        \n        \n          \n                    {\n        \n        \n          \n                      
"node"
: 

"
HTTP Request
"

,\n        \n        \n          \n                      
"type"
: 

"
main
"

,\n        \n        \n          \n                      
"index"
: 
0
\n        \n        \n          \n                    }\n        \n        \n          \n                  ]\n        \n        \n          \n                ]\n        \n        \n          \n              }\n        \n        \n          \n            },\n        \n        \n          \n            
"active"
: 
true
,\n        \n        \n          \n            
"settings"
: {\n        \n        \n          \n              
"executionOrder"
: 

"
v1
"

\n        \n        \n          \n            },\n        \n        \n          \n            
"versionId"
: 

"
a7b14ee9-2dba-4969-ac41-46e978a684f0
"

,\n        \n        \n          \n            
"meta"
: {\n        \n        \n          \n              
"templateCredsSetupCompleted"
: 
true
,\n        \n        \n          \n              
"instanceId"
: 

"
9ba32224070d4dc8fcb21b0beaef541f293bee284936bfc4b558be62fb1d5880
"

\n        \n        \n          \n            },\n        \n        \n          \n            
"id"
: 

"
g5ZbR78EFynwfgLo
"

,\n        \n        \n          \n            
"tags"
: []\n        \n        \n          \n          }\n        \n  \n
\n\n\n    
\n\n  
\n
\n\n      
\n      
\n        view raw\n        \n          n8n_stirlingpdf.json\n        \n        hosted with &#10084; by GitHub\n      
\n    
\n
\n","stylesheet":"https://github.githubassets.com/assets/gist-embed-05ac2616078a.css"}" data-component-name="GitgistToDOM">

    

      

        

  

    
    

        

  
  

  
    

    

      This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
      [Learn more about bidirectional Unicode characters](https://github.co/hiddenchars)
    

  
            Show hidden characters

  

    
    

  
        
          
          {
        
        
          
            
"name"
: 

"
My workflow
"

,
        
        
          
            
"nodes"
: [
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"method"
: 

"
POST
"

,
        
        
          
                  
"url"
: 

"
https://spdf-wk8skow8s4okw0084c40o44w.apps.thedailyaistudio.com/api/v1/convert/pdf/img
"

,
        
        
          
                  
"sendHeaders"
: 
true
,
        
        
          
                  
"headerParameters"
: {
        
        
          
                    
"parameters"
: [
        
        
          
                      {
        
        
          
                        
"name"
: 

"
accept
"

,
        
        
          
                        
"value"
: 

"
*/*
"

        
        
          
                      }
        
        
          
                    ]
        
        
          
                  },
        
        
          
                  
"sendBody"
: 
true
,
        
        
          
                  
"contentType"
: 

"
multipart-form-data
"

,
        
        
          
                  
"bodyParameters"
: {
        
        
          
                    
"parameters"
: [
        
        
          
                      {
        
        
          
                        
"name"
: 

"
imageFormat
"

,
        
        
          
                        
"value"
: 

"
png
"

        
        
          
                      },
        
        
          
                      {
        
        
          
                        
"name"
: 

"
singleOrMultiple
"

,
        
        
          
                        
"value"
: 

"
multiple
"

        
        
          
                      },
        
        
          
                      {
        
        
          
                        
"name"
: 

"
colorType
"

,
        
        
          
                        
"value"
: 

"
color
"

        
        
          
                      },
        
        
          
                      {
        
        
          
                        
"name"
: 

"
dpi
"

,
        
        
          
                        
"value"
: 

"
300
"

        
        
          
                      },
        
        
          
                      {
        
        
          
                        
"parameterType"
: 

"
formBinaryData
"

,
        
        
          
                        
"name"
: 

"
fileInput
"

,
        
        
          
                        
"inputDataFieldName"
: 

"
Document
"

        
        
          
                      },
        
        
          
                      {
        
        
          
                        
"name"
: 

"
pageNumbers
"

,
        
        
          
                        
"value"
: 

"
all
"

        
        
          
                      }
        
        
          
                    ]
        
        
          
                  },
        
        
          
                  
"options"
: {
        
        
          
                    
"redirect"
: {
        
        
          
                      
"redirect"
: {
        
        
          
                        
"followRedirects"
: 
true
,
        
        
          
                        
"maxRedirects"
: 
21

        
        
          
                      }
        
        
          
                    },
        
        
          
                    
"response"
: {}
        
        
          
                  }
        
        
          
                },
        
        
          
                
"type"
: 

"
n8n-nodes-base.httpRequest
"

,
        
        
          
                
"typeVersion"
: 
4.2
,
        
        
          
                
"position"
: [
        
        
          
                  
180
,
        
        
          
                  
0

        
        
          
                ],
        
        
          
                
"id"
: 

"
fffda37f-9cbb-4c43-a3f9-6713aeb03447
"

,
        
        
          
                
"name"
: 

"
HTTP Request
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {},
        
        
          
                
"type"
: 

"
n8n-nodes-base.compression
"

,
        
        
          
                
"typeVersion"
: 
1.1
,
        
        
          
                
"position"
: [
        
        
          
                  
180
,
        
        
          
                  
520

        
        
          
                ],
        
        
          
                
"id"
: 

"
3030f096-aeb4-41bd-b025-c92b7ee53db3
"

,
        
        
          
                
"name"
: 

"
Compression
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"operation"
: 

"
write
"

,
        
        
          
                  
"fileName"
: 

"
/tmp/test.zip
"

,
        
        
          
                  
"options"
: {}
        
        
          
                },
        
        
          
                
"type"
: 

"
n8n-nodes-base.readWriteFile
"

,
        
        
          
                
"typeVersion"
: 
1
,
        
        
          
                
"position"
: [
        
        
          
                  
180
,
        
        
          
                  
260

        
        
          
                ],
        
        
          
                
"id"
: 

"
5e167523-9b7b-43a8-abaa-4cfb8bfe3d7f
"

,
        
        
          
                
"name"
: 

"
Read/Write Files from Disk
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"fileSelector"
: 

"
/tmp/test.zip
"

,
        
        
          
                  
"options"
: {}
        
        
          
                },
        
        
          
                
"type"
: 

"
n8n-nodes-base.readWriteFile
"

,
        
        
          
                
"typeVersion"
: 
1
,
        
        
          
                
"position"
: [
        
        
          
                  
360
,
        
        
          
                  
260

        
        
          
                ],
        
        
          
                
"id"
: 

"
df7b0786-5cdb-4e18-9545-68cae24068fd
"

,
        
        
          
                
"name"
: 

"
Read/Write Files from Disk1
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"resource"
: 

"
image
"

,
        
        
          
                  
"operation"
: 

"
analyze
"

,
        
        
          
                  
"modelId"
: {
        
        
          
                    
"__rl"
: 
true
,
        
        
          
                    
"value"
: 

"
gpt-4o
"

,
        
        
          
                    
"mode"
: 

"
list
"

,
        
        
          
                    
"cachedResultName"
: 

"
GPT-4O
"

        
        
          
                  },
        
        
          
                  
"text"
: 

"
Can you return ocr and also information about charts and data in the image so we can get a clear snse of what is in the PDF pages we turned into images
"

,
        
        
          
                  
"inputType"
: 

"
base64
"

,
        
        
          
                  
"options"
: {}
        
        
          
                },
        
        
          
                
"type"
: 

"
@n8n/n8n-nodes-langchain.openAi
"

,
        
        
          
                
"typeVersion"
: 
1.8
,
        
        
          
                
"position"
: [
        
        
          
                  
920
,
        
        
          
                  
560

        
        
          
                ],
        
        
          
                
"id"
: 

"
acda1fcc-68c3-45f5-b67e-d61444b03999
"

,
        
        
          
                
"name"
: 

"
OpenAI1
"

,
        
        
          
                
"credentials"
: {
        
        
          
                  
"openAiApi"
: {
        
        
          
                    
"id"
: 

"
I7RAbk2vtoz2FIGj
"

,
        
        
          
                    
"name"
: 

"
OpenAi account
"

        
        
          
                  }
        
        
          
                }
        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"content"
: 

"
## Do what you want with the data coming out of the loop
"

        
        
          
                },
        
        
          
                
"type"
: 

"
n8n-nodes-base.stickyNote
"

,
        
        
          
                
"position"
: [
        
        
          
                  
600
,
        
        
          
                  
320

        
        
          
                ],
        
        
          
                
"typeVersion"
: 
1
,
        
        
          
                
"id"
: 

"
18395ecf-faee-4822-ba43-494664ad7623
"

,
        
        
          
                
"name"
: 

"
Sticky Note
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"options"
: {}
        
        
          
                },
        
        
          
                
"type"
: 

"
n8n-nodes-base.splitInBatches
"

,
        
        
          
                
"typeVersion"
: 
3
,
        
        
          
                
"position"
: [
        
        
          
                  
620
,
        
        
          
                  
520

        
        
          
                ],
        
        
          
                
"id"
: 

"
1e2bbd75-c905-465f-bb19-36bd90b695c2
"

,
        
        
          
                
"name"
: 

"
Loop Over Items
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"jsCode"
: 

"
let results = [];
\n\n
for (item of items) {
\n
    for (key of Object.keys(item.binary)) {
\n
        results.push({
\n
            json: {
\n
                fileName: item.binary[key].fileName
\n
            },
\n
            binary: {
\n
                data: item.binary[key],
\n
            }
\n
        });
\n
    }
\n
}
\n\n
return results;
"

        
        
          
                },
        
        
          
                
"type"
: 

"
n8n-nodes-base.code
"

,
        
        
          
                
"typeVersion"
: 
2
,
        
        
          
                
"position"
: [
        
        
          
                  
400
,
        
        
          
                  
520

        
        
          
                ],
        
        
          
                
"id"
: 

"
0c3694bb-54ff-41d8-9f7f-0dd8173de8da
"

,
        
        
          
                
"name"
: 

"
List
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {},
        
        
          
                
"type"
: 

"
n8n-nodes-base.noOp
"

,
        
        
          
                
"typeVersion"
: 
1
,
        
        
          
                
"position"
: [
        
        
          
                  
920
,
        
        
          
                  
400

        
        
          
                ],
        
        
          
                
"id"
: 

"
8273ebf0-0d8f-4815-b10b-a1698305a739
"

,
        
        
          
                
"name"
: 

"
No Operation, do nothing
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"content"
: 

"
## Stirling PDF to Vision
\n\n\n
### Docs
\n
[here](https://spdf-wk8skow8s4okw0084c40o44w.apps.thedailyaistudio.com/?lang=en_US)
\n\n
## Swagger
\n
[swagger](https://spdf-wk8skow8s4okw0084c40o44w.apps.thedailyaistudio.com/swagger-ui/index.html)
"

,
        
        
          
                  
"height"
: 
240
,
        
        
          
                  
"width"
: 
700

        
        
          
                },
        
        
          
                
"type"
: 

"
n8n-nodes-base.stickyNote
"

,
        
        
          
                
"position"
: [
        
        
          
                  
400
,
        
        
          
                  
-40

        
        
          
                ],
        
        
          
                
"typeVersion"
: 
1
,
        
        
          
                
"id"
: 

"
5ae8d5af-be7b-41df-b6d4-51922abec846
"

,
        
        
          
                
"name"
: 

"
Sticky Note1
"

        
        
          
              },
        
        
          
              {
        
        
          
                
"parameters"
: {
        
        
          
                  
"formTitle"
: 

"
Upload PDF
"

,
        
        
          
                  
"formDescription"
: 

"
Upload a PDF for Vision Review
"

,
        
        
          
                  
"formFields"
: {
        
        
          
                    
"values"
: [
        
        
          
                      {
        
        
          
                        
"fieldLabel"
: 

"
Document
"

,
        
        
          
                        
"fieldType"
: 

"
file
"

,
        
        
          
                        
"multipleFiles"
: 
false
,
        
        
          
                        
"acceptFileTypes"
: 

"
.pdf
"

,
        
        
          
                        
"requiredField"
: 
true

        
        
          
                      }
        
        
          
                    ]
        
        
          
                  },
        
        
          
                  
"options"
: {}
        
        
          
                },
        
        
          
                
"type"
: 

"
n8n-nodes-base.formTrigger
"

,
        
        
          
                
"typeVersion"
: 
2.2
,
        
        
          
                
"position"
: [
        
        
          
                  
-220
,
        
        
          
                  
40

        
        
          
                ],
        
        
          
                
"id"
: 

"
9cdf3073-6f1b-4287-a7b4-8dc488cf43b6
"

,
        
        
          
                
"name"
: 

"
On form submission
"

,
        
        
          
                
"webhookId"
: 

"
7d077ce1-8ec7-401b-9605-ec838c24f3e6
"

        
        
          
              }
        
        
          
            ],
        
        
          
            
"pinData"
: {
        
        
          
              
"On form submission"
: [
        
        
          
                {
        
        
          
                  
"json"
: {
        
        
          
                    
"Document"
: {
        
        
          
                      
"filename"
: 

"
pickleball_facts_2023.pdf
"

,
        
        
          
                      
"mimetype"
: 

"
application/pdf
"

,
        
        
          
                      
"size"
: 
30446

        
        
          
                    },
        
        
          
                    
"submittedAt"
: 

"
2025-04-30T22:48:49.254+02:00
"

,
        
        
          
                    
"formMode"
: 

"
production
"

        
        
          
                  }
        
        
          
                }
        
        
          
              ]
        
        
          
            },
        
        
          
            
"connections"
: {
        
        
          
              
"HTTP Request"
: {
        
        
          
                
"main"
: [
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
Read/Write Files from Disk
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ]
        
        
          
                ]
        
        
          
              },
        
        
          
              
"Compression"
: {
        
        
          
                
"main"
: [
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
List
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ]
        
        
          
                ]
        
        
          
              },
        
        
          
              
"Read/Write Files from Disk"
: {
        
        
          
                
"main"
: [
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
Read/Write Files from Disk1
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ]
        
        
          
                ]
        
        
          
              },
        
        
          
              
"Read/Write Files from Disk1"
: {
        
        
          
                
"main"
: [
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
Compression
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ]
        
        
          
                ]
        
        
          
              },
        
        
          
              
"OpenAI1"
: {
        
        
          
                
"main"
: [
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
Loop Over Items
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ]
        
        
          
                ]
        
        
          
              },
        
        
          
              
"Loop Over Items"
: {
        
        
          
                
"main"
: [
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
No Operation, do nothing
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ],
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
OpenAI1
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ]
        
        
          
                ]
        
        
          
              },
        
        
          
              
"List"
: {
        
        
          
                
"main"
: [
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
Loop Over Items
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ]
        
        
          
                ]
        
        
          
              },
        
        
          
              
"On form submission"
: {
        
        
          
                
"main"
: [
        
        
          
                  [
        
        
          
                    {
        
        
          
                      
"node"
: 

"
HTTP Request
"

,
        
        
          
                      
"type"
: 

"
main
"

,
        
        
          
                      
"index"
: 
0

        
        
          
                    }
        
        
          
                  ]
        
        
          
                ]
        
        
          
              }
        
        
          
            },
        
        
          
            
"active"
: 
true
,
        
        
          
            
"settings"
: {
        
        
          
              
"executionOrder"
: 

"
v1
"

        
        
          
            },
        
        
          
            
"versionId"
: 

"
a7b14ee9-2dba-4969-ac41-46e978a684f0
"

,
        
        
          
            
"meta"
: {
        
        
          
              
"templateCredsSetupCompleted"
: 
true
,
        
        
          
              
"instanceId"
: 

"
9ba32224070d4dc8fcb21b0beaef541f293bee284936bfc4b558be62fb1d5880
"

        
        
          
            },
        
        
          
            
"id"
: 

"
g5ZbR78EFynwfgLo
"

,
        
        
          
            
"tags"
: []
        
        
          
          }
        
  

    

  

      

      

        [view raw](https://gist.github.com/alnutile/97b079dc58b1f760691fb5671aeeb65f/raw/3c444fa61de7337ea7280f64f82bbc9a661c7748/n8n_stirlingpdf.json)
        
          n8n_stirlingpdf.json
        
        hosted with ❤ by [GitHub](https://github.com)
      

    

This is the workflow.

In Coolify just make a new Project → New Resource and choose Stirling PDF and you are ready to go!

---POSTBREAK---

