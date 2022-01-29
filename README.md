# svelte-esbuild bug reproduce conditions

when `typescript({ content }) {}` replacement is embedded into the automatic preprocessor, it fails with:

![](https://github.com/endigma/svelte-esbuild/blob/main/images/fail-1.png?raw=true)
![](https://gitlab.com/endigma/svelte-esbuild/-/raw/main/images/fail-1.png)

and 

![](https://github.com/endigma/svelte-esbuild/blob/main/images/fail-2.png?raw=true)
![](https://gitlab.com/endigma/svelte-esbuild/-/raw/main/images/fail-2.png)

when replacement is wrapped in `typescript()` from `svelte-preprocessor`, functions normally.

this seems almost nonsensical but it's reproducible.

## success

`rollup.config.js`
```js
// import spp from "svelte-preprocess";
// import { typescript } from "svelte-preprocess"
// ...
preprocess: [
    typescript({
        typescript({ content }) {
            const { code, map } = transformSync(content, {
                loader: "ts",
            });
            return { code, map };
        }
    }),
    spp({
        typescript: false
    }),
],
// ...
```

## fail

`rollup.config.js`
```js
// import spp from "svelte-preprocess";
// ...
preprocess: [
    spp({
        typescript({ content }) {
            const { code, map } = transformSync(content, {
                loader: "ts",
            });
            return { code, map };
        }
    }),
],
// ...
```

# run

```sh
git clone git@gitlab.com:endigma/svelte-esbuild.git
cd svelte-esbuild

yarn install
yarn dev # or yarn build
```
