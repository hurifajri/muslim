import os
import re

directory = '/Users/hurifajri/Developer/Projects/Personal/dua/muslim/src'
pages_dir = os.path.join(directory, 'pages')

import_pattern = re.compile(r'^import\s+([A-Za-z0-9_]+)\s+from\s+[\'"]([\.@/a-zA-Z0-9_-]+)[\'"];?', flags=re.MULTILINE)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            original_content = content
            
            # 1. Change exports
            # Only do this if it's NOT in the pages directory
            # because Next.js pages require default exports
            if not filepath.startswith(pages_dir):
                content = re.sub(r'^export default (\w+);?$', r'export { \1 };', content, flags=re.MULTILINE)
            
            # 2. Change imports
            # We want to change `import Name from '@/path'` to `import { Name } from '@/path'`
            def replacer(match):
                name, path = match.groups()
                if path.startswith('.') or path.startswith('@/'):
                    return f"import {{ {name} }} from '{path}'"
                return match.group(0)
            
            content = import_pattern.sub(replacer, content)

            if content != original_content:
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Updated {filepath}")
