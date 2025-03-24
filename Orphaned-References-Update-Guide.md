# Orphaned References Update Guide

## Overview

After removing the 15 orphaned pages from the codebase, there are still references to these pages in other files. This guide explains how to use the `update-orphaned-references.js` script to identify and update these references.

## The Script

The `update-orphaned-references.js` script is designed to:

1. Scan the entire codebase for references to the removed orphaned pages
2. Identify different types of references (imports, component usage, routes, etc.)
3. Suggest appropriate replacements for each reference
4. Apply the changes with user confirmation

## Running the Script

To run the script, use the following command:

```bash
node update-orphaned-references.js
```

## How It Works

The script processes each file in the codebase and performs the following steps:

1. **Identification**: Finds references to orphaned pages using regex patterns
2. **Categorization**: Categorizes references by type (import, component, route, other)
3. **Suggestion**: Suggests replacements based on predefined mappings
4. **Confirmation**: Asks for user confirmation before applying changes
5. **Application**: Applies the changes and backs up the original file

## Replacement Mappings

The script uses the following mappings to replace references to orphaned pages:

| Orphaned Page | Replacement |
|---------------|-------------|
| FunctionBlocks | Admin |
| EmergencyCare | Dashboard |
| Help | Dashboard |
| HospitalWorkflows | Dashboard |
| Index | Dashboard |
| MedicalHistory | PatientDetail |
| Messages | Dashboard |
| NewOrder | Orders |
| Notifications | Dashboard |
| PageNotFound | Dashboard |
| Records | PatientDetail |
| Register | Login |
| RxNormManagement | Medications |
| SectorSelection | Dashboard |
| NotFound | Dashboard |

## User Interaction

When the script finds references in a file, it will:

1. Display the file path
2. Show each reference with line number and context
3. Suggest a replacement for each reference
4. Ask for confirmation:
   - `y`: Apply the changes to the file
   - `n`: Skip the changes for this file
   - `s`: Skip this file entirely

## Backup Files

Before applying any changes, the script creates a backup of the original file with a `.bak` extension. If you need to revert the changes, you can restore the backup file.

## After Running the Script

After running the script, you should:

1. Test the application to ensure it works correctly
2. Review the changes made by the script
3. Commit the changes to the repository
4. Create a pull request for review

## Manual Review

While the script automates most of the process, some references may require manual review and updates. These include:

1. Complex component usage with custom props
2. References in comments or documentation
3. References in non-standard patterns

## Example

Here's an example of how the script processes a file:

```
Processing src/components/layout/Header.tsx...
Found 2 references in src/components/layout/Header.tsx:
1. Line 15: import Notifications from '../pages/Notifications';
   Suggestion: import Dashboard from '../pages/Dashboard'
   Action: replace

2. Line 42: <Notifications />
   Suggestion: <Dashboard />
   Action: replace

Apply these changes? (y/n/s) y
Successfully backed up src/components/layout/Header.tsx to src/components/layout/Header.tsx.bak
Successfully updated src/components/layout/Header.tsx
```

## Troubleshooting

If you encounter any issues while running the script:

1. Check the error messages in the console
2. Restore the backup file if needed
3. Try running the script again with different options
4. For complex files, consider manual updates

## Conclusion

The `update-orphaned-references.js` script provides a semi-automated way to update references to orphaned pages in the codebase. By using this script, you can ensure that all references are properly updated, maintaining the integrity of the application after removing the orphaned pages.