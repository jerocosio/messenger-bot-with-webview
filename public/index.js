Vue.component('step-wizard', {
    template: `<div class="container">
        <div class="tab-details question">
            <slot></slot>
        </div>
        <div class="answers">
            <div>
                <button @click="changeTab(++currentActive,true)" v-if="currentActive != totalTabs -1">✅ Sí</button>
                <button @click="changeTab(++currentActive,false)" v-if="currentActive != totalTabs -1">❌ No</button>
                <div class="result" v-if="currentActive == totalTabs -1">
                    <div v-if="needsAttention == true">
                        <p>
                        🔴  ADVERTENCIA DE RIESGO:
                        </br>
                        Es muy probable que estés contagiado de COVID-19. No te alarmes, llama al 📞 132 y uno de nuestros expertos te atenderá.
                        </p>
                        <p>
                        🔹 Evita contacto con otras personas y auto-aíslate mientras se verifica tu estado.
                        </br>
                        🔹 Si vives con más personas, recuerda mantener distancia de al menos un metro y medio con ellos.
                        </br>
                        🙍‍♀️➖➖🙍‍♀️
                        </p>
                        <p>
                            Llama al 📞 132 o consulta con tu médico si presentas síntomas respiratorios graves.
                        </p>
                    </div>
                    <div v-if="needsAttention == false">
                    <p>
                    ⚠️ MANTENTE ALERTA: <br>
                        Todo parece estar bien. Sin embargo, tienes un riesgo intermedio de una infección respiratoria.
                        </p>
                        <p>
                            Llama al 📞 132 o consulta con tu médico si presentas síntomas respiratorios graves.
                        </p>
                    </div>
                    <a href="https://www.messenger.com/closeWindow/?image_url=https://bot-el-salvador.herokuapp.com/ministerio-de-salud.png&display_text=Volviendo...">Volver al bot.</a>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            tabs: [],
            currentActive: 0,
            totalTabs: 0,
            needsAttention: false
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
            if (answer) {
                this.needsAttention = true;
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