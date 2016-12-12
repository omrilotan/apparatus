# Apparatus

[Published version on the Chrome webstore](https://chrome.google.com/webstore/detail/apparatus/egomopmdlnnollipkhoocfgookfcepoe)

> Apparatus is an open source bookmark and collaboration tool. Create your spreadsheet and start collaborating!

Try the [demo document](https://docs.google.com/spreadsheets/d/1fHX2H_Qv_Ah4GBeT-zTvJQCsrXKd4ZkWSFjtw2yEWqI/edit#gid=0) to get started using Apparatus

### Table structure
| label | type | title | value
| ----- | ---- | ----- | -----
| Group name | Link type (options below) | Display text | Value

### Supported types
| type | description | value example
| ---- | ----------- | -------------
| `link` | A simple link | `https://website.com`
| `search` | Perform a search using an input search term | `https://duckduckgo.com/?q=`
| `cookie` | Toggle cookie (insert cookie with value / remove cookie) | `cookie_name:cookie_value`
| `script` | Run a script on the hosting page (optional last string statement is the notification message) | `console.log('hello');'I said Hello'`
| `note` | A sticky note | Just text

## Publish a new spreadsheet
To make your spreadsheet available for consumption, publish it to the web:

Publish to web | Automatically update when changes are made
-------------- | ------------------------------------------
![publish-1](https://cloud.githubusercontent.com/assets/516342/21141906/4b3e9814-c148-11e6-9deb-4683d91a456d.png) | ![publish-2](https://cloud.githubusercontent.com/assets/516342/21141907/4b677cf2-c148-11e6-9de7-7d72202c0272.png)


## Contribute

1. Keep the app slim.
2. Zip the extension using the shell script `./pack.sh`
