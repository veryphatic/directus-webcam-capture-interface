import { Collection as CollectionRaw, CollectionType } from '@directus/types';
import type { ForeignKey } from '@directus/schema';
export interface Collection extends CollectionRaw {
    name: string;
    icon: string;
    type: CollectionType;
    color?: string | null;
}

export type RelationMeta = {
    id: number;
    many_collection: string;
    many_field: string;
    one_collection: string | null;
    one_field: string | null;
    one_collection_field: string | null;
    one_allowed_collections: string[] | null;
    one_deselect_action: 'nullify' | 'delete';
    junction_field: string | null;
    sort_field: string | null;
    system?: boolean;
};

export type Relation = {
    collection: string;
    field: string;
    related_collection: string | null;
    schema: ForeignKey | null;
    meta: RelationMeta | null;
};

// ------------------------------------ My Directus types

export type ImageMetaType = {
    title: string,
    description: string,
}

export type DirectusFile = {
    id: string;
    type?: string;
    title?: string;
    description?: string;
    filename_download?: string;
    modified_on?: string;
}

export type Item = {
    id: number,
    directus_files_id: DirectusFile
}

export type FileObject = {
    id: string;
    title: string;
    description: string;
    filename_disk: string;
    filename_download: string;
    type: string;
    folder: string;
    uploaded_by: string;
    uploaded_on: string;
    modified_by: string;
    filesize: number;
    width: number;
    height: number;
    focal_point_x: number;
    focal_point_y: number;
    duration: number;
    location: string;
    tags: string[];
    metadata: Record<string, any>;
};


export type MultipleFilesAlias = {
    create?: Item[];
    update?: Item[];
    delete?: number[]
}

// ------------------------------------ Non Directus

// view for rendering thumbnails
export type FileObjectItem = FileObject & {
    // junction table id
    itemId: number;
    deleted: boolean;
};
