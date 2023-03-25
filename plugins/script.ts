export interface MyPluginInterface {
    hoge (): string
  }
  
  class MyPlugin implements MyPluginInterface {
    hoge () {
      // この中では、Nuxtインスタンスやルートオブジェクトも取得可能
      console.log(useNuxtApp())
      console.log(useRoute().query)
  
      return 'hoge'
    }
  }
  
  export default defineNuxtPlugin(nuxtApp => {
    return {
      provide: {
        my: new MyPlugin
      }
    }
  })