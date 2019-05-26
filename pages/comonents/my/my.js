Component({
    externalClasses: [],
    options: {
        styleIsolation: 'apply-shared'
    },
    properties:{
        motA: String,
    },
    methods: {
    },
    created(){
        console.log('组件created')
    },
    attached(){
        console.log('组件attach')
    },
    detached(){
        console.log('组件detached')
    },
    ready(){
        console.log('组件ready')
    }


})