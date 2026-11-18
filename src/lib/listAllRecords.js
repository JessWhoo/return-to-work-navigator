// Reads every record of an entity one page at a time, for code that genuinely
// needs the full set (exports, whole-set analysis). A single unpaged read
// stops silently at the platform cap; this follows the cursor to the end.
export async function listAllRecords(entity, sort) {
  const all = [];
  let cursor;
  do {
    const options = { limit: 500 };
    if (sort) options.sort = sort;
    if (cursor) options.cursor = cursor;
    const page = await entity.list(options);
    all.push(...(page.items || []));
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return all;
}