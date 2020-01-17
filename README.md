# @cyberalien/conditional-replacements

This library is designed for build time import paths replacements.

It was created for Iconify Icon Finder build process, making it possible to substitute directories during build process. This makes it possible to use various language packs, icon packs, replace unused components with empty functions.

## Replacements

Replacements class is for replacing imports.

Example of original code:

```js
import { React } from 'react';
// @iconify-replacement: '/components/default/'
import { Input } from './components/default/input';
import { Button } from './components/default/button';
// @iconify-replacement: '/phrases/'
import { lang } from '../phrases/';
```

Parser:

```js
import { readFileSync, writeFileSync } from 'fs';
import { Replacements } from '@cyberalien/conditional-replacements';

const replacements = new Replacements(
	{
		'/components/default/': '/components/figma/',
		'/phrases/': '/phrases_de/',
	},
	'@iconify-replacement'
);

// Parse ./lib/foo.js
let code = readFileSync('./lib/foo.js', 'utf8');
cost = replacements.parse(code);
writeFileSync('./lib/foo.js', code, 'utf8');
```

Parsed code:

```js
import { React } from 'react';
import { Input } from './components/figma/input';
import { Button } from './components/figma/button';
import { lang } from '../phrases_de/';
```

In example above '/components/default/' was replaced with '/components/figma/', '/phrases/' was replaced with '/phrases_de/'.

### Rules

1. There can only be one replacement active at a time.

2. Only lines following replacement comment are replaced. Any invalid line will break replacements.

Example:

```js
// @iconify-replacement: '/components/default/'
import { Input } from './components/default/input';

import { Button } from './components/default/button';
```

will result in:

```js
import { Input } from './components/figma/input';

import { Button } from './components/default/button';
```

Second import was not replaced because empty line above it broke pattern.

3. Replacements are case sensitive.

# License

This library is dual-licensed under Apache 2.0 and GPL 2.0 license. You may select, at your option, one of the above-listed licenses.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0`

© 2020 Vjacheslav Trushkin
