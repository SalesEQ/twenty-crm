import { msg } from '@lingui/core/macro';
import { FieldMetadataType } from 'twenty-shared/types';

import { RelationOnDeleteAction } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-on-delete-action.interface';
import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { NumberDataType } from 'src/engine/metadata-modules/field-metadata/interfaces/field-metadata-settings.interface';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/index-metadata.entity';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { CALL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
    FieldTypeAndNameMetadata,
    getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { FavoriteWorkspaceEntity } from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const TITLE_FIELD_NAME = 'title';

export const SEARCH_FIELDS_FOR_CALL: FieldTypeAndNameMetadata[] = [
  { name: TITLE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.call,
  namePlural: 'calls',
  labelSingular: msg`Call`,
  labelPlural: msg`Calls`,
  description: msg`A call record with SalesEQ analytics`,
  icon: STANDARD_OBJECT_ICONS.call,
  shortcut: 'C',
  labelIdentifierStandardId: CALL_STANDARD_FIELD_IDS.title,
})
@WorkspaceIsSearchable()
export class CallWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Title`,
    description: msg`The call title`,
    icon: 'IconPhone',
  })
  title: string;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.duration,
    type: FieldMetadataType.NUMBER,
    label: msg`Duration`,
    description: msg`Call duration in minutes`,
    icon: 'IconClock',
    settings: {
      dataType: NumberDataType.INT,
      type: 'number',
    },
  })
  @WorkspaceIsNullable()
  duration: number | null;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.startedAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Started At`,
    description: msg`Call start time`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  startedAt: Date | null;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.endedAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Ended At`,
    description: msg`Call end time`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  endedAt: Date | null;

  // SalesEQ Analytics Fields
  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.eqConfidence,
    type: FieldMetadataType.NUMBER,
    label: msg`EQ Confidence`,
    description: msg`SalesEQ confidence score (0-100)`,
    icon: 'IconTrendingUp',
    settings: {
      dataType: NumberDataType.FLOAT,
      decimals: 2,
      type: 'percentage',
    },
  })
  @WorkspaceIsNullable()
  eqConfidence: number | null;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.eqEmpathy,
    type: FieldMetadataType.NUMBER,
    label: msg`EQ Empathy`,
    description: msg`SalesEQ empathy score (0-100)`,
    icon: 'IconHeart',
    settings: {
      dataType: NumberDataType.FLOAT,
      decimals: 2,
      type: 'percentage',
    },
  })
  @WorkspaceIsNullable()
  eqEmpathy: number | null;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.eqClarity,
    type: FieldMetadataType.NUMBER,
    label: msg`EQ Clarity`,
    description: msg`SalesEQ clarity score (0-100)`,
    icon: 'IconEye',
    settings: {
      dataType: NumberDataType.FLOAT,
      decimals: 2,
      type: 'percentage',
    },
  })
  @WorkspaceIsNullable()
  eqClarity: number | null;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.summaryMd,
    type: FieldMetadataType.RICH_TEXT_V2,
    label: msg`Summary`,
    description: msg`AI-generated call summary in markdown`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  summaryMd: string | null;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.recordingUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Recording URL`,
    description: msg`URL to the call recording`,
    icon: 'IconVideo',
  })
  @WorkspaceIsNullable()
  recordingUrl: string | null;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.opportunity,
    type: RelationType.MANY_TO_ONE,
    label: msg`Opportunity`,
    description: msg`Call related opportunity`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => OpportunityWorkspaceEntity,
    inverseSideFieldKey: 'calls',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  opportunity: Relation<OpportunityWorkspaceEntity> | null;

  @WorkspaceJoinColumn('opportunity')
  opportunityId: string | null;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.person,
    type: RelationType.MANY_TO_ONE,
    label: msg`Person`,
    description: msg`Call participant`,
    icon: 'IconUser',
    inverseSideTarget: () => PersonWorkspaceEntity,
    inverseSideFieldKey: 'calls',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  person: Relation<PersonWorkspaceEntity> | null;

  @WorkspaceJoinColumn('person')
  personId: string | null;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.company,
    type: RelationType.MANY_TO_ONE,
    label: msg`Company`,
    description: msg`Call related company`,
    icon: 'IconBuildingSkyscraper',
    inverseSideTarget: () => CompanyWorkspaceEntity,
    inverseSideFieldKey: 'calls',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  company: Relation<CompanyWorkspaceEntity> | null;

  @WorkspaceJoinColumn('company')
  companyId: string | null;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.favorites,
    type: RelationType.ONE_TO_MANY,
    label: msg`Favorites`,
    description: msg`Favorites linked to the call`,
    icon: 'IconHeart',
    inverseSideTarget: () => FavoriteWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  favorites: Relation<FavoriteWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.attachments,
    type: RelationType.ONE_TO_MANY,
    label: msg`Attachments`,
    description: msg`Attachments linked to the call`,
    icon: 'IconFileImport',
    inverseSideTarget: () => AttachmentWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  attachments: Relation<AttachmentWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: CALL_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the call.`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: CALL_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_CALL,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
} 