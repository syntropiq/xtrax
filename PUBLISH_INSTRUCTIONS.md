# Publishing @syntropiq/xtrax to npm

## Prerequisites

1. Make sure you have an npm account and are logged in:
   ```bash
   npm login
   ```

2. Verify you have access to publish under the @syntropiq organization:
   ```bash
   npm whoami
   npm org ls syntropiq
   ```

## Publishing Steps

1. **Final verification** - Check package contents:
   ```bash
   npm pack --dry-run
   ```

2. **Publish to npm**:
   ```bash
   npm publish
   ```

## Package Summary

- **Name**: `@syntropiq/xtrax`
- **Version**: `1.0.0`
- **License**: GPL-3.0-or-later
- **Size**: ~36.3 kB (127.5 kB unpacked)
- **Files**: 60 files total
- **Repository**: https://github.com/syntropiq/xtrax

## Components Included

✅ **PCREUtils** - Python-compatible regex processing
✅ **TemplateEngine** - Variable substitution with circular reference detection  
✅ **DataProcessing** - JSON loading, validation, transformation, and caching
✅ **TypeScript Project Template** - Modern ESM configuration templates

## Usage After Publishing

Users can install with:
```bash
npm install @syntropiq/xtrax
```

And import components:
```typescript
import { PCREUtils, TemplateEngine, DataProcessing } from '@syntropiq/xtrax';
```

## Next Steps

Once published, this package can be used to build:
- `@amjur/courts-db-ts` - TypeScript court database
- `@amjur/laws-db-ts` - Laws database  
- Other legal data processing applications

The package is ready for publication! 🚀
