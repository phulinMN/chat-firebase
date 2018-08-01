<template>
    <div class="container">
        <feature />
    </div>
</template>

<script>
import Feature from '~/components/Feature.vue'
export default {
    components: {
        Feature
    }
}
</script>
<style scoped>
.box {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: space-between;
}
</style>


