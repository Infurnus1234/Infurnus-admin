export function profilePhotoDocument<T extends {documentType: string; documentCode?: string}>(documents: readonly T[]): T | undefined {
  return documents.find(document => (document.documentCode || document.documentType).toUpperCase() === 'PROFILE_PHOTO');
}
