# faora-kai

![npm](https://img.shields.io/npm/v/faora-kai) ![Build
status](https://github.com/flarebyte/faora-kai/actions/workflows/main.yml/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/faora-kai)

![npm type definitions](https://img.shields.io/npm/types/faora-kai)
![node-current](https://img.shields.io/node/v/faora-kai)
![NPM](https://img.shields.io/npm/l/faora-kai)

![Experimental](https://img.shields.io/badge/status-experimental-blue)

> The Zod helper library, because sometimes you need a little help from a
> Kryptonian

Helper functions for zod, the typeScript-first schema validation with static
type inference

![Hero image for faora-kai](faora-kai-hero-512.jpeg)

Highlights:

-   Simplify error handling with zod by using a custom formatter
-   Protect sensitive data from leaking in error messages by using a
    privacy-aware formatter
-   Create a dictionary of string constraints based on the Fibonacci
    sequence

A few examples of commands:

Parse an object using Zod validation:

```bash
const result = safeParse<TestSchema>(content, {schema, formatting:
'human-friendly'});


```

Declare a string field from 1 to 10 characters:

```bash
stringFields.string1To10

```

## Documentation and links

-   [Code Maintenance :wrench:](MAINTENANCE.md)
-   [Code Of Conduct](CODE_OF_CONDUCT.md)
-   [Api for faora-kai](API.md)
-   [Contributing :busts\_in\_silhouette: :construction:](CONTRIBUTING.md)
-   [Diagram for the code base :triangular\_ruler:](INTERNAL.md)
-   [Vocabulary used in the code base :book:](CODE_VOCABULARY.md)
-   [Architectural Decision Records :memo:](DECISIONS.md)
-   [Contributors
    :busts\_in\_silhouette:](https://github.com/flarebyte/faora-kai/graphs/contributors)
-   [Dependencies](https://github.com/flarebyte/faora-kai/network/dependencies)
-   [Glossary
    :book:](https://github.com/flarebyte/overview/blob/main/GLOSSARY.md)
-   [Software engineering principles
    :gem:](https://github.com/flarebyte/overview/blob/main/PRINCIPLES.md)
-   [Overview of Flarebyte.com ecosystem
    :factory:](https://github.com/flarebyte/overview)
-   [Npm dependencies](DEPENDENCIES.md)

## Related

## Installation

This package is [ESM
only](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77).

```bash
yarn add faora-kai
```
