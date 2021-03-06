# Unzipper edge cases

The unzipper provides ACR with file rename functionallity, and with that comes many edge cases to support the slew of unstandard `.cbr` naming conventions.

This is an ongoing doc to help design a unzipper that can correctly handle many edge cases and correctly structure the output of files.

## Supported

#### Append letter(s) naming conventions

Sometimes filenames will append a letter to signify a special case, such as a multi-page layout, or the cover page. In our case, these are ignored.

Example:
`comic-name_001f.jpg`

#### Normalizing numbers

Numbers with leading zeros are normalized to not included any.

#### Zero indexing of files

If a image collection starts at 1 rather than 0, the unzipper should shift the file names to be zero indexed.

## Partially supported (need improvements)

#### Multiple indexes in one name

A case where a multipage layout or spread will include multiple indexes in the file name.

Example:

`comic-name_004_005m.jpg`

This is fixed by closing gaps in the names. It does not take into account the first page number in the name, and renames all the files to be sequential again.

#### Throwing out non indexed files

Any files that don't have a number will be deleted. This is only considered partially supported because it should check if the file is part of a sequential order.

Example:
`gr0up-n4me.jpg` would be kept and renamed to 4.jpg, rather than being deleted.

This could possibly be fixed by first trying to only parse numbers with leading zeros to test the naming convention.

## Unsupported (no implemtation yet)

If there is an unsupported feature, please add an [issue](https://github.com/simonlc/Arc-Comic-Reader/issues/new), or a project task in the backlog.
