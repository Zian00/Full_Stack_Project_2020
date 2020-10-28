# Code Style

This documents helps to guide the look and feel of the code so that even when there are multiple developer, the style remains consistent. You may read more about it [here](https://javascript.info/coding-style).

## Style Guide

| Rules             | Choices                         |
| ----------------- | ------------------------------- |
| Case Styles       | camelCase and snake_case        |
| Acronym Case      | ibm                             |
| Indentation Style | 1TBS                            |
| Indentation       | Tabs                            |
| Indentation Space | 4 spaces                        |
| Semicolon         | Optional                        |

## Examples

Based on your chosen rules, give an example of a code that follows the code style and an example of a code that does not follow the code style. The examples you give should cover all the above defined rule.

### Good Example

```js
function getBasicDataFromBackend(callback) {
    $.get(basicDataUrl, basicDataQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}
```

### Bad Example

```js
function getbasicdatafrombackend(callback) {$.get(basicDataUrl, basicDataQuery).done((result) => callback(null, result))
.fail((message) => callback(message, null));}
```
