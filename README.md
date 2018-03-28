## fe_proxy

modify data by jsonPath

### usage

- install

```bash
   npm install fe_proxy -g
```

- set `fe_proxy.json` in your `CWD` or `HOME`

- run proxy server
` fep --server`

### rules config: fe_proxy.json

you can use path to update data json, support wildcard *

- `url`: the path you want to modify data
- `rules`: use rule in pairs mode, `[jsonPath, value]]`, like: 

    ```js
    [['a.c', 0], ['a.b.d', 5]]
    ```
   - jsonPath: 'a.b.c', 'a.0.k', '', 'a.*.d'
   - value: can be any value


```json
[{
    "url": "api/v2/content/official_shop",
    "rules": [
        ["data.mock", false]
    ]
}, {
    "url": "api/v1/category_list",
    "rules": [
        ["*.main.display_name", "mockname"]
    ]
}]
```

### command
```
fep
 --server [start proxy server]
 --port [proxy port]
 --host [proxy host]
 --on   [turn global proxy on]
 --off  [turn global proxy off]
```
