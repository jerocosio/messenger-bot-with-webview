Vue.component('step-wizard', {
    template: `
    <div class="container">
        <div class="tab-details question" v-if="!(currentActive == totalTabs -1)">
            <slot></slot>
        </div>
        <div class="answers">
            <div>
                <div v-if="currentActive != totalTabs -1">
                    <button @click="changeTab(++currentActive,true)" >👍 Yes</button>
                    <button @click="changeTab(++currentActive,false)">👎 No</button>
                </div>
                <div class="result" v-if="currentActive == totalTabs -1">
                    <div v-if="happyCustomer == true">
                        <p>
                            😊  Thanks for your feedback 🎉!
                        </p>
                        </br>
                        <p>
                            This information is really valuable for us, so thanks for getting the time to answer. In case you nees support we can continue talking through Messenger.
                        </p>
                    </div>
                    <div v-if="happyCustomer == false">
                        <p>
                            😊  Thanks for your feedback 🎉!
                        </p>
                        </br>
                        <p>
                            We see that you had some issues with our services and we would like to .
                        </p>
                    </div>
                    <div class="btn-conatiner">
                        <a  href="https://www.messenger.com/closeWindow/?image_url=https://bot-el-salvador.herokuapp.com/ministerio-de-salud.png&display_text=Back to Messenger..." >
                            <button class="button-back">Back to Messenger</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            tabs: [],
            currentActive: 0,
            totalTabs: 0,
            happyCustomer: true
        }
    },
    created() {
        this.tabs = this.$children;
    },
    mounted() {
        this.totalTabs = this.tabs.length;
    },
    methods: {
        changeTab(makeTabActive, answer) {
            if (!answer && this.happyCustomer) {
                this.happyCustomer = answer;
            }
            this.tabs.forEach(tab => {
                tab.isActive = false;
            });
            this.tabs[makeTabActive].isActive = true;
        }
    }
});

Vue.component('tab', {
    template: `<div v-show="isActive" class="question"><p>{{name}}</p><slot></slot></div>`,
    props: {
        name: { required: true },
        selected: { default: false }
    },
    data() {
        return {
            isActive: false
        }
    },
    created() {
        this.isActive = this.selected
    }
})

let app = new Vue({
    el: '#app'
});