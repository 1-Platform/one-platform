/* eslint-disable no-useless-escape */
export default function uniqueIdFromPath(path: string): string {
  return (
    path
      .toLowerCase()
      /* Replace any special characters with `-` */
      .replace(/[\ \-\/\:\@\[\]\`\{\~\.]+/g, '-')
      /* Remove any starting or ending `-` */
      .replace(/^-+|-+$/g, '')
      /* Removing multiple consecutive `-`s */
      .replace(/--+/g, '-')
  );
}
