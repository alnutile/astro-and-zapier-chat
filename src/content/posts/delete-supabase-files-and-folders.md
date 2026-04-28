---
title: "Delete Supabase Files and Folders in N8N"
date: 2025-09-04
excerpt: "Quick tip"
tags: []
# original_url: https://substack.com/home/post/p-172805596
---

I did a post and video here 👉🏻

But seems I left out the delete node. If you paste the JSON below you will see the start of a delete node. 

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
"nodes"
: [\n        \n        \n          \n                  {\n        \n        \n          \n                      
"parameters"
: {\n        \n        \n          \n                          
"method"
: 

"
DELETE
"

,\n        \n        \n          \n                          
"url"
: 

"
YOUR_URL/object/scripts/yourfile-or-folder
"

,\n        \n        \n          \n                          
"authentication"
: 

"
predefinedCredentialType
"

,\n        \n        \n          \n                          
"nodeCredentialType"
: 

"
supabaseApi
"

,\n        \n        \n          \n                          
"options"
: {}\n        \n        \n          \n                      },\n        \n        \n          \n                      
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
-96
,\n        \n        \n          \n                          
208
\n        \n        \n          \n                      ],\n        \n        \n          \n                      
"onError"
: 

"
continueErrorOutput
"

\n        \n        \n          \n                  }\n        \n        \n          \n              ],\n        \n        \n          \n              
"connections"
: {\n        \n        \n          \n                  
"DeleteScripts3"
: {\n        \n        \n          \n                      
"main"
: [\n        \n        \n          \n                          [],\n        \n        \n          \n                          []\n        \n        \n          \n                      ]\n        \n        \n          \n                  }\n        \n        \n          \n              },\n        \n        \n          \n              
"pinData"
: {},\n        \n        \n          \n              
"meta"
: {\n        \n        \n          \n                  
"templateCredsSetupCompleted"
: 
true
,\n        \n        \n          \n                  
"instanceId"
: 

"
76f1428275a37eb7efae2c253491cb7e28a1c00a7f61e35ca27560baecb96e71
"

\n        \n        \n          \n              }\n        \n        \n          \n          }\n        \n  \n
\n\n\n    
\n\n  
\n
\n\n      
\n      
\n        view raw\n        \n          delete.json\n        \n        hosted with &#10084; by GitHub\n      
\n    
\n
\n","stylesheet":"https://github.githubassets.com/assets/gist-embed-59543e005c9c.css"}" data-component-name="GitgistToDOM">

    

      

        

  

    
    

        

  
  

  
    

    

      This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
      [Learn more about bidirectional Unicode characters](https://github.co/hiddenchars)
    

  
            Show hidden characters

  

    
    

  
        
          
          {
        
        
          
              
"nodes"
: [
        
        
          
                  {
        
        
          
                      
"parameters"
: {
        
        
          
                          
"method"
: 

"
DELETE
"

,
        
        
          
                          
"url"
: 

"
YOUR_URL/object/scripts/yourfile-or-folder
"

,
        
        
          
                          
"authentication"
: 

"
predefinedCredentialType
"

,
        
        
          
                          
"nodeCredentialType"
: 

"
supabaseApi
"

,
        
        
          
                          
"options"
: {}
        
        
          
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
        
        
          
                          
-96
,
        
        
          
                          
208

        
        
          
                      ],
        
        
          
                      
"onError"
: 

"
continueErrorOutput
"

        
        
          
                  }
        
        
          
              ],
        
        
          
              
"connections"
: {
        
        
          
                  
"DeleteScripts3"
: {
        
        
          
                      
"main"
: [
        
        
          
                          [],
        
        
          
                          []
        
        
          
                      ]
        
        
          
                  }
        
        
          
              },
        
        
          
              
"pinData"
: {},
        
        
          
              
"meta"
: {
        
        
          
                  
"templateCredsSetupCompleted"
: 
true
,
        
        
          
                  
"instanceId"
: 

"
76f1428275a37eb7efae2c253491cb7e28a1c00a7f61e35ca27560baecb96e71
"

        
        
          
              }
        
        
          
          }
        
  

    

  

      

      

        [view raw](https://gist.github.com/alnutile/d57f7bd396d684bda8978b4d0972577e/raw/e7caf1ad0ec00a8e6160d901cc8bf35f84683f89/delete.json)
        
          delete.json
        
        hosted with ❤ by [GitHub](https://github.com)
      

    

 I did have a situation though where I had to delete the files in the folder before it would let me delete the folder. I should dig into their docs more to see if I'm just missing the obvious.

---POSTBREAK---

