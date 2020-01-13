import VideoUtils from '../../util/videoUtils';
import PromiseManager from '../../core/promiseManager';
const _clamp = require('lodash/clamp');

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
            template: '비디오가 연결되었는가?',
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
            func(sprite, script) {
                const result = VideoUtils.checkUserCamAvailable();
                return result.toString();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        draw_webcam: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic',
            statements: [],
            template: '비디오 화면 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['보이기', 'on'], ['가리기', 'off']],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                type: 'draw_webcam',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'video',
            isNotFor: ['video'],
            func(sprite, script) {
                const value = script.getField('VALUE');
                VideoUtils.cameraSwitch(value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        set_camera_option: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic',
            statements: [],
            template: '비디오 %1 효과를 %2 으로 정하기',
            params: [
                {
                    type: 'Dropdown',
                    options: [['밝기', 'contrast'], ['투명도', 'opacity']],
                    value: 'brightness',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '0',
                },
            ],
            events: {},
            def: {
                type: 'set_camera_option',
            },
            paramsKeyMap: {
                TARGET: 0,
                VALUE: 1,
            },
            class: 'video',
            isNotFor: ['video'],
            func(sprite, script) {
                const target = script.getField('TARGET');
                let value = _clamp(
                    script.getNumberValue('VALUE'),
                    target === 'brightness' ? -100 : 0,
                    100
                );

                VideoUtils.setOptions(target, value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};
