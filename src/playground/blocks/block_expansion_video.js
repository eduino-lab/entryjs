import audioUtils from '../../util/audioUtils';
import PromiseManager from '../../core/promiseManager';

Entry.EXPANSION_BLOCK.video = {
    name: 'video',
    imageName: 'audio.svg',
    title: {
        ko: '비디오 감지',
        en: 'Video Detection',
        jp: 'ビデオ検出',
    },
    titleKey: 'template.video_title_text',
    description: Lang.Msgs.expansion_video_description,
    descriptionKey: 'Msgs.expansion_video_description',
    isInitialized: false,
    init() {
        if (this.isInitialized) {
            return;
        }
        Entry.EXPANSION_BLOCK.video.isInitialized = true;
    },
};

Entry.EXPANSION_BLOCK.video.getBlocks = function() {
    return {
        video_title: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.video_title_text,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'center',
                },
            ],
            def: {
                type: 'video_title',
            },
            class: 'video',
            isNotFor: ['video'],
            events: {},
        },
        check_webcam: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            template: '웹캠이 연결되어있는가?',
            params: [],
            events: {},
            def: {
                type: 'check_webcam',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const result = await audioUtils.checkUserMicAvailable();
                return result.toString();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};
