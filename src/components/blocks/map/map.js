import * as ymaps3 from 'ymaps3';

export default class Map {
    static texts = {
        cafe: 'Кафе'
    };
    static paths = {
        img: './assets/images/map/img.webp'
    }

    /**
     * @param {string} containerId — id контейнера для карты
     * @param {[number, number]} center - положение центра карты [долгота, широта]
     * @param {[number, number]} markerPos - положение маркера объекта [долгота, широта]
     * @param {number} zoom — начальный зум
     */
    constructor(
        containerId, 
        center = [30.437564, 59.993232],
        markerPos = [30.437378, 59.994350],
        zoom = 15
    ) {
        this.containerId = containerId;
        this.center = center;
        this.markerPos = markerPos;
        this.zoom = zoom;
        
        ymaps3.ready.then(() => this._init());
    }

    async _init() {
        const { 
            YMap, 
            YMapDefaultSchemeLayer, 
            YMapDefaultFeaturesLayer,
            YMapMarker
        } = ymaps3;

        this.map = new YMap(
            document.getElementById(this.containerId),
            {
                location: {
                    center: this.center,
                    zoom: this.zoom
                }
            },
        );

        this.map.addChild(new YMapDefaultSchemeLayer({
            customization: [
                {
                    tags:     { any: ['road'] },
                    elements: 'geometry.fill',
                    stylers:  [{ color: '#c0c7d5' }]
                }
            ]
        }));

        this.map.addChild(new YMapDefaultFeaturesLayer());

        const markerElement = document.createElement('div');
        markerElement.className = 'marker';

        const markerImage = document.createElement('img');
        markerImage.src = Map.paths.img;
        markerImage.alt = '';
        markerImage.classList.add('image');
        markerElement.appendChild(markerImage);

        const markerElementText = document.createElement('span');
        markerElementText.innerText = Map.texts.cafe;
        markerElementText.classList.add('text');
        markerElement.appendChild(markerElementText);

        const marker = new YMapMarker(
            {
                coordinates: this.markerPos,
            },
            markerElement
        );

        this.map.addChild(marker);
    }

    destroy() {
        this.map?.destroy();
    }
}
