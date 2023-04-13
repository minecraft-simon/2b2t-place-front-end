<template>
    <div ref="panzoomElement" class="panzoom">
        <slot></slot>
    </div>
</template>

<script>
import panzoom from '@panzoom/panzoom';

export default {
    name: 'PanzoomComponent',
    mounted() {
        this.$nextTick(() => {
            this.panzoomInstance = panzoom(this.$refs.panzoomElement, {
                // Your panzoom options here
                contain: 'outside'
            });
        });
    },
    beforeDestroy() {
        if (this.panzoomInstance) {
            this.panzoomInstance.dispose();
        }
    },
    methods: {
        // Add custom methods to control panzoom (e.g., zoomIn, zoomOut, etc.)
        zoomIn() {
            this.panzoomInstance.smoothZoom(0, 0, 1.1);
        },
        zoomOut() {
            this.panzoomInstance.smoothZoom(0, 0, 0.9);
        },
        reset() {
            this.panzoomInstance.reset();
        },
    },
};
</script>

<style scoped>
.panzoom {
    /* Add your custom styles for the panzoom container */
    overflow: hidden;
    position: relative;
}
</style>
