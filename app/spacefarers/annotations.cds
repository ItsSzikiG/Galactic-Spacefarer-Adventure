using CosmicService as service from '../../srv/cosmic-service';
annotate service.Spacefarers with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Value : originPlanet,
            },
            {
                $Type : 'UI.DataField',
                Value : spacesuitColor,
            },
            {
                $Type : 'UI.DataField',
                Value : stardustCollection,
            },
            {
                $Type : 'UI.DataField',
                Value : wormholeNavigationSkill,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.HeaderInfo : {
        $Type : 'UI.HeaderInfoType',
        TypeName : 'Spacefarer',
        TypeNamePlural : 'Spacefarers',
        Title : { Value : name },
    },
    UI.SelectionFields : [ originPlanet, spacesuitColor ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Value : originPlanet,
        },
        {
            $Type : 'UI.DataField',
            Value : spacesuitColor,
        },
        {
            $Type : 'UI.DataField',
            Value : stardustCollection,
        },
        {
            $Type : 'UI.DataField',
            Value : wormholeNavigationSkill,
        },
    ],
);

annotate service.Spacefarers with {
    name                    @title : 'Name';
    originPlanet            @title : 'Origin Planet';
    spacesuitColor          @title : 'Spacesuit Color';
    stardustCollection      @title : 'Stardust Collection';
    wormholeNavigationSkill @title : 'Wormhole Navigation Skill';
    department              @title : 'Department';
    position                @title : 'Position';
};

annotate service.Spacefarers with {
    department @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Departments',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : department_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            },
        ],
    }
};

annotate service.Spacefarers with {
    position @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Positions',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : position_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'title',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'level',
            },
        ],
    }
};

