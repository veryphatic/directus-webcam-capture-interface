// Source: https://github.com/directus/directus/blob/main/app/src/composables/use-relation-m2m.ts
/*
Licensor:             Monospace, Inc.

Licensed Work:        Directus
                      The Licensed Work is Copyright © 2023 Monospace, Inc.

Additional Use Grant: You may use the Licensed Work in production as long as
                      your Total Finances do not exceed US $5,000,000 for the
                      most recent 12-month period, provided that Monospace, Inc.
                      will not be liable to you in any way, including for any
                      damages, including general, special, incidental or
                      consequential damages, arising out of such use.

                      References to: “Total Finances” mean the largest of your
                      aggregate gross revenues, entire budget, and/or funding
                      (no matter the source); “you” and “your” include (without
                      limitation) any individual or entity agreeing to these
                      terms and any affiliates of such individual or entity; and
                      “production” mean any use other than (i) development of
                      (including evaluation of the Licensed Work), debugging, or
                      testing your offerings, or (ii) making the Licensed Work
                      available standalone in unmodified object code form.

Change Date:          Three years from release date

Change License:       GNU General Public License (GPL) v3

For information about alternative licensing arrangements, please visit
https://directus.io/pricing.

--------------------------------------------------------------------------------

Business Source License 1.1

Terms

The Licensor hereby grants you the right to copy, modify, create derivative
works, redistribute, and make non-production use of the Licensed Work. The
Licensor may make an Additional Use Grant, above, permitting limited production
use.

Effective on the Change Date, or the fourth anniversary of the first publicly
available distribution of a specific version of the Licensed Work under this
License, whichever comes first, the Licensor hereby grants you rights under the
terms of the Change License, and the rights granted in the paragraph above
terminate.

If your use of the Licensed Work does not comply with the requirements currently
in effect as described in this License, you must purchase a commercial license
from the Licensor, its affiliated entities, or authorized resellers, or you must
refrain from using the Licensed Work.

All copies of the original and modified Licensed Work, and derivative works of
the Licensed Work, are subject to this License. This License applies separately
for each version of the Licensed Work and the Change Date may vary for each
version of the Licensed Work released by Licensor.

You must conspicuously display this License on each original or modified copy of
the Licensed Work. If you receive the Licensed Work in original or modified form
from a third party, the terms and conditions set forth in this License apply to
your use of that work.

Any use of the Licensed Work in violation of this License will automatically
terminate your rights under this License for the current and all other versions
of the Licensed Work.

This License does not grant you any right in any trademark or logo of Licensor
or its affiliates (provided that you may use a trademark or logo of Licensor as
expressly required by this License).

TO THE EXTENT PERMITTED BY APPLICABLE LAW, THE LICENSED WORK IS PROVIDED ON AN
“AS IS” BASIS. LICENSOR HEREBY DISCLAIMS ALL WARRANTIES AND CONDITIONS, EXPRESS
OR IMPLIED, INCLUDING (WITHOUT LIMITATION) WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND TITLE.

MariaDB hereby grants you permission to use this License’s text to license your
works, and to refer to it using the trademark “Business Source License”, as long
as you comply with the Covenants of Licensor below.

Covenants of Licensor

In consideration of the right to use this License’s text and the “Business
Source License” name and trademark, Licensor covenants to MariaDB, and to all
other recipients of the licensed work to be provided by Licensor:

1. To specify as the Change License the GPL Version 2.0 or any later version,
   or a license that is compatible with GPL Version 2.0 or a later version,
   where “compatible” means that software provided under the Change License can
   be included in a program with software provided under GPL Version 2.0 or a
   later version. Licensor may specify additional Change Licenses without
   limitation.

2. To either: (a) specify an additional grant of rights to use that does not
   impose any additional restriction on the right granted in this License, as
   the Additional Use Grant; or (b) insert the text “None”.

3. To specify a Change Date.

4. Not to modify this License in any other way.

Notice

The Business Source License (this document, or the "License") is not an Open
Source license. However, the Licensed Work will eventually be made available
under an Open Source License, as stated in this License.

License text copyright © 2023 MariaDB plc, All Rights Reserved.
“Business Source License” is a trademark of MariaDB plc.

*/

import { useStores } from '@directus/extensions-sdk';
import { Field, Relation } from '@directus/types';
import { Collection } from '../types';
import { computed, Ref } from 'vue';

export type RelationM2M = {
	relation: Relation;
	relatedCollection: Collection;
	relatedPrimaryKeyField: Field;
	junctionCollection: Collection;
	junctionPrimaryKeyField: Field;
	junctionField: Field;
	reverseJunctionField: Field;
	junction: Relation;
	sortField?: string;
	type: 'm2m';
};

/*
One1              Many|Many: junctionCollection         One2: relatedCollection
┌─────────┐       ┌─────────────────────────────┐       ┌─────────────────────┐
│id       ├───┐   │id: junctionPKField          │   ┌───┤id: relatedPKField   │
│many     │   └──►│one1_id: reverseJunctionField│   │   │                     │
└─────────┘       │one2_id: junctionField       │◄──┘   └─────────────────────┘
                  │sort: sortField              │
                  └─────────────────────────────┘
 */

export function useRelationM2M(collection: Ref<string>, field: Ref<string>) {
    const {useCollectionsStore, useFieldsStore, useRelationsStore} = useStores();
	const relationsStore = useRelationsStore();
	const collectionsStore = useCollectionsStore();
	const fieldsStore = useFieldsStore();

	const relationInfo = computed<RelationM2M | undefined>(() => {
		const relations = relationsStore.getRelationsForField(collection.value, field.value);

		const junction = relations.find(
			(relation) =>
				relation.related_collection === collection.value &&
				relation.meta?.one_field === field.value &&
				relation.meta.junction_field,
		);

		if (!junction) return undefined;

		const relation = relations.find(
			(relation) => relation.collection === junction.collection && relation.field === junction.meta?.junction_field,
		);

		if (!relation) return undefined;

		return {
			relation: relation,
			relatedCollection: collectionsStore.getCollection(relation.related_collection as string),
			relatedPrimaryKeyField: fieldsStore.getPrimaryKeyFieldForCollection(relation.related_collection as string),
			sortField: junction.meta?.sort_field ?? undefined,
			junctionCollection: collectionsStore.getCollection(junction.collection),
			junctionPrimaryKeyField: fieldsStore.getPrimaryKeyFieldForCollection(junction.collection),
			junctionField: fieldsStore.getField(junction.collection, junction.meta?.junction_field as string),
			reverseJunctionField: fieldsStore.getField(junction.collection, relation.meta?.junction_field as string),
			junction: junction,
			type: 'm2m',
		} as RelationM2M;
	});

	return { relationInfo };
}
