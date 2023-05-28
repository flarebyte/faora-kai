# Internal

> Overview of the code base of faora-kai

This document has been generated automatically by
[baldrick-doc-ts](https://github.com/flarebyte/baldrick-doc-ts)

## Diagram of the dependencies

```mermaid
classDiagram
class `enum-utils.ts`{
  +describeEnum()
}
class `field-utils.ts`{
  +isSingleLine()
}
class `format-friendly-message.ts`{
  - extractUnionErrors()
  - formatArray()
  - formatUnknown()
  - formatPrimitive()
  - formatPrimitives()
  +formatFriendlyMessage()
}
class `format-message-with-privacy.ts`{
  - formatStringValidation()
  +formatMessageWithPrivacy()
}
class `index.ts`
class `model.ts`
class `parsing-utils.ts`{
  +safeParse()
  +isParsingSuccessful()
  - getFormatter()
}
class `primitive-fields.ts`{
  - singleLineMessage()
}
class `zod`{
  +z()
  +type ZodSchema()
  +type z()
  +type StringValidation()
  +type Primitive()
}
class `./model.js`{
  +type StringFieldValidator()
  +type StringEffectFieldValidator()
  +type ModelValidation()
  +type FormatZodMessage()
  +type Success()
  +type ValidationError()
}
class `./format-message-with-privacy.js`{
  +formatMessageWithPrivacy()
}
class `./format-friendly-message.js`{
  +formatFriendlyMessage()
}
class `./field-utils.js`{
  +isSingleLine()
}
`format-friendly-message.ts`-->`zod`
`format-friendly-message.ts`-->`./model.js`
`format-message-with-privacy.ts`-->`zod`
`format-message-with-privacy.ts`-->`./model.js`
`model.ts`-->`zod`
`parsing-utils.ts`-->`zod`
`parsing-utils.ts`-->`./model.js`
`parsing-utils.ts`-->`./format-message-with-privacy.js`
`parsing-utils.ts`-->`./format-friendly-message.js`
`primitive-fields.ts`-->`zod`
`primitive-fields.ts`-->`./model.js`
`primitive-fields.ts`-->`./field-utils.js`
```
