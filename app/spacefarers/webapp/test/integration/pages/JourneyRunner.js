sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"galactic/spacefarer/ui/spacefarers/test/integration/pages/SpacefarersList",
	"galactic/spacefarer/ui/spacefarers/test/integration/pages/SpacefarersObjectPage"
], function (JourneyRunner, SpacefarersList, SpacefarersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('galactic/spacefarer/ui/spacefarers') + '/test/flp.html#app-preview',
        pages: {
			onTheSpacefarersList: SpacefarersList,
			onTheSpacefarersObjectPage: SpacefarersObjectPage
        },
        async: true
    });

    return runner;
});

