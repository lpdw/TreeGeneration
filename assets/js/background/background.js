var granimInstance = new Granim({
    element: '#canvas-image',
    direction: 'top-bottom',
    opacity: [1, .5, 0],
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                ['#485563', '#29323c', '#29323c'],
                ['#00c6ff', '#0072ff', '#0072ff']
            ],
            transitionSpeed: 10000
        }
    }
});
