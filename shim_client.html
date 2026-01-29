// shim_client.js

// Minimal fallback to allow the debug page to test REST connectivity without the official SDK.

// It exposes window.createClient(url, key) which returns an object with a .from(table).select(...).

(
function
(
)
{
  
if
 (
window
.__shim_client_installed) 
return
;
  
window
.__shim_client_installed = 
true
;
  
function
 
parseSelectArgs
(
args
)
{
    
// very small parser: we ignore any params and always request all (*)

    
return
 
'*'
;
  }
  
function
 
createClient
(
url, key
)
{
    
const
 base = (url || 
''
).replace(
/\/+$/
, 
''
); 
// trim trailing slash

    
return
 {
      
from
: 
function
(
table
)
{
        
return
 {
          
select
: 
async
 
function
(
/* cols or params */
)
{
            
const
 cols = parseSelectArgs(
arguments
);
            
const
 u = base + 
'/rest/v1/'
 + 
encodeURIComponent
(
String
(table)) + 
'?select='
 + 
encodeURIComponent
(cols);
            
const
 headers = { 
Accept
: 
'application/json'
 };
            
if
 (key) {
              headers[
'apikey'
] = key;
              headers[
'Authorization'
] = 
'Bearer '
 + key;
            }
            
try
 {
              
const
 res = 
await
 fetch(u, { 
method
: 
'GET'
, headers });
              
const
 text = 
await
 res.text();
              
let
 json = 
null
;
              
try
 { json = 
JSON
.parse(text); } 
catch
(e){ json = text; }
              
return
 { 
data
: res.ok ? json : 
null
, 
error
: res.ok ? 
null
 : { 
message
: 
'HTTP '
 + res.status + 
' '
 + res.statusText, 
body
: json }, 
status
: res.status };
            } 
catch
 (err){
              
return
 { 
data
: 
null
, 
error
: { 
message
: 
String
(err) }, 
status
: 
0
 };
            }
          }
        };
      }
    };
  }
  
window
.createClient = createClient;
  
window
.__shim_client = { createClient };
})();
