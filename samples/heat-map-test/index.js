
Modelo.init("https://bim-portal-dev.modeloapp.com");

var appToken = 'VHlsaW4sTW9kZWxvTG92ZXNUeWxpbg=='; // Fetch from build.modeloapp.com's dashboard

var getValue = function (x, y, data) {
    var distX = Math.abs(data.x - x);
    var distY = Math.abs(data.y - y);
    if (distX * distX + distY * distY < data.radius * data.radius) {
        return data.value;
    }
    else {
        return 0;
    }
}

var createData = function () {
    var SAMPLE_WIDTH = 1024;
    var SAMPLE_HEIGHT = 1024;
    var data = new Float32Array(SAMPLE_WIDTH * SAMPLE_HEIGHT);

    var originWith = 16;
    var originHeight = 16;
    var originData = [
        {
            x: Math.random() * 16,
            y: Math.random() * 16,
            radius: Math.random() * 256,
            value: Math.random()
        },
        {
            x: Math.random() * 16,
            y: Math.random() * 16,
            radius: Math.random() * 256,
            value: Math.random()
        }
    ]
    // var originData = [
    //     {
    //         x: 2,
    //         y: 2,
    //         radius: 128,
    //         value: 0.3
    //     },
    //     {
    //         x: 4,
    //         y: 15,
    //         radius: 40,
    //         value: 1.0
    //     },
    //     {
    //         x: 4,
    //         y: 2,
    //         radius: 60,
    //         value: 0.2
    //     },{
    //         x: 10,
    //         y: 2,
    //         radius: 90,
    //         value: 0.7
    //     },
    //     {
    //         x: 10,
    //         y: 14,
    //         radius: 20,
    //         value: 0.5
    //     }
    // ]

    // var originData = [
    //     {
    //         x: 2,
    //         y: 2,
    //         radius: 140,
    //         value: 0.3
    //     },
    //     {
    //         x: 4,
    //         y: 15,
    //         radius: 140,
    //         value: 1.0
    //     },
    //     {
    //         x: 4,
    //         y: 2,
    //         radius: 160,
    //         value: 0.2
    //     },{
    //         x: 10,
    //         y: 2,
    //         radius: 190,
    //         value: 0.7
    //     },
    //     {
    //         x: 10,
    //         y: 14,
    //         radius: 120,
    //         value: 0.5
    //     }
    // ]


    originData.forEach(function (item) {
        item.x = item.x / originWith * SAMPLE_WIDTH;
        item.y = item.y / originHeight * SAMPLE_HEIGHT;
    })

    for (var i = 0; i < SAMPLE_WIDTH; i++) {
        for (var j = 0; j < SAMPLE_HEIGHT; j++) {
            var index = i * SAMPLE_WIDTH + j;
            for (var k = 0, len = originData.length; k < len; k++) {
                var value = getValue(i, j, originData[k]);
                data[index] = value;
                if (value !== 0) {
                    break;
                }
            }
        }
    }

    return data;
}

var createPlaneTexture = function (heatMapTest) {
    heatMapTest.createPlaneTexture();
}

var createPlaneHeatMap = function (heatMapTest) {
    for (var i = 0; i < 3; i++) {
        var textureBuffer = createData();
        heatMapTest.createPlaneHeatMap(textureBuffer, 1024, 1024, [0, 0, i]);
    }
}

var createHeightMap = function (heatMapTest) {
    var textureBuffer = createData();
    heatMapTest.createHeightMap(textureBuffer, 1024, 1024);
}

var createSlab = function (heatMapTest) {
    var textureBuffer = createData();
    heatMapTest.createSlab(textureBuffer, 1024, 1024);
}

var createVolumeData = function () {
    var originalData = [
        {
            x: 40,
            y: 40,
            z: 40,
            value: 1.0,
            radius: 30
        },
        {
            x: 128,
            y: 128,
            z: 128,
            value: 1.0,
            radius: 50
        },
        {
            x: 40,
            y: 180,
            z: 60,
            value: 1.0,
            radius: 40
        },
        {
            x: 180,
            y: 180,
            z: 60,
            value: 1.0,
            radius: 40
        },
        {
            x: 180,
            y: 180,
            z: 180,
            value: 1.0,
            radius: 40
        }
    ]
    var data = new Float32Array(4096 * 4096);
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
            for (var ii = 0; ii < 256; ii++) {
                for (var jj = 0; jj < 256; jj++) {
                    var z = i * 16 + j;
                    var index = i * 16 * 256 * 256 + ii * 16 * 256 + j * 256 + jj;
                    data[index] = 0.0;
                    for (var k = 0; k < originalData.length; k++) {
                        var deltaX = ii - originalData[k].x;
                        var deltaY = jj - originalData[k].y;
                        var deltaZ = z - originalData[k].z;
                        if (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ < originalData[k].radius * originalData[k].radius) {
                            data[index] = originalData[k].value
                            // * Math.sin(3.14 / 2 * (originalData[k].radius - Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)) / originalData[k].radius);
                            break;
                        }
                    }

                    // if (ii % 255 < 1  || jj % 255 < 1) {
                    //     data[index] = 0.4;
                    // }
                    // else {
                    //     data[index] = 0.0;
                    // }

                    // if (i==0 && j == 0) {
                    //     data[index] = 1.0;
                    // }
                }
            }
        }
    }

    return data;
}

var createVolumeRendering = function (heatMapTest) {
    var textureBuffer = createVolumeData();
    heatMapTest.createVolumeRendering(textureBuffer, 256.0, 256.0, 16, 16);
}

var createDataFromXls = function (sampleWidth, sampleHeight) {
    var origin = [[6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [6, 3],
    [1, 1],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [15, 12],
    [2, 1],
    [9, 13],
    [9, 13],
    [9, 13],
    [3, 3],
    [3, 3],
    [11, 14],
    [2, 2],
    [9, 1],
    [3, 3],
    [15, 1],
    [15, 1],
    [15, 1],
    [15, 1],
    [15, 1],
    [15, 1],
    [10, 3],
    [10, 3],
    [10, 3],
    [10, 3],
    [10, 3],
    [10, 3],
    [10, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [11, 15],
    [11, 15],
    [11, 15],
    [11, 15],
    [11, 15],
    [11, 15],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [15, 11],
    [2, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [13, 3],
    [13, 3],
    [4, 2],
    [4, 2],
    [7, 1],
    [7, 1],
    [7, 1],
    [7, 1],
    [1, 3],
    [4, 1],
    [4, 1],
    [4, 1],
    [4, 1],
    [4, 1],
    [1, 1],
    [8, 13],
    [8, 13],
    [8, 13],
    [1, 1],
    [1, 1],
    [8, 15],
    [8, 15],
    [8, 15],
    [8, 15],
    [8, 15],
    [8, 15],
    [8, 15],
    [8, 15],
    [3, 3],
    [10, 2],
    [10, 2],
    [3, 3],
    [12, 15],
    [12, 15],
    [12, 15],
    [2, 3],
    [2, 3],
    [2, 3],
    [13, 1],
    [13, 1],
    [13, 1],
    [13, 1],
    [4, 1],
    [4, 1],
    [13, 14],
    [14, 3],
    [14, 3],
    [14, 3],
    [14, 3],
    [14, 3],
    [14, 3],
    [14, 3],
    [14, 3],
    [4, 3],
    [4, 3],
    [15, 9],
    [15, 9],
    [15, 9],
    [15, 9],
    [15, 9],
    [15, 9],
    [15, 9],
    [15, 9],
    [15, 9],
    [15, 9],
    [15, 9],
    [14, 6],
    [14, 6],
    [14, 6],
    [14, 6],
    [14, 6],
    [14, 6],
    [14, 6],
    [14, 6],
    [4, 1],
    [13, 15],
    [13, 15],
    [13, 15],
    [13, 15],
    [13, 15],
    [13, 15],
    [13, 15],
    [13, 15],
    [13, 15],
    [13, 15],
    [13, 15],
    [10, 3],
    [10, 3],
    [10, 3],
    [10, 3],
    [10, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [14, 8],
    [14, 8],
    [14, 8],
    [12, 14],
    [12, 14],
    [1, 2],
    [1, 2],
    [15, 1],
    [15, 1],
    [15, 1],
    [15, 1],
    [15, 1],
    [15, 1],
    [15, 1],
    [3, 3],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [13, 13],
    [3, 3],
    [12, 15],
    [12, 15],
    [12, 15],
    [7, 15],
    [6, 1],
    [8, 3],
    [8, 3],
    [8, 3],
    [14, 8],
    [14, 8],
    [14, 8],
    [14, 8],
    [14, 8],
    [14, 8],
    [3, 4],
    [3, 4],
    [13, 2],
    [13, 2],
    [13, 2],
    [13, 2],
    [2, 3],
    [15, 5],
    [15, 5],
    [15, 5],
    [15, 5],
    [15, 5],
    [15, 5],
    [15, 5],
    [2, 3],
    [2, 3],
    [2, 3],
    [2, 3],
    [15, 5],
    [2, 3],
    [2, 3],
    [11, 14],
    [11, 14],
    [11, 14],
    [11, 14]
    ];

    var map = {

    }
    origin.forEach(function (vec) {
        var key = "" + vec[0] + "-" + vec[1];
        if (!map[key]) {
            map[key] = 1;
        }
        else {
            map[key] += 1;
        }
    })

    var data = new Float32Array(sampleWidth * sampleHeight);

    var totalLength = sampleWidth * sampleHeight;

    var max = -1;
    for (var key in map) {
        if (max < map[key]) {
            max = map[key];
        }
    }

    for (var key in map) {
        map[key] /= max;
        var temp = key.split("-");
        var x = parseInt(temp[0]) / 16 * sampleWidth;
        var y = parseInt(temp[1]) / 16 * sampleHeight;

        for (var i = -sampleWidth / 32; i < sampleWidth / 32; i++) {
            for (var j = -sampleHeight / 32; j < sampleHeight / 32; j++) {
                if (y + j > sampleWidth - 1 || y + j < 0 || x + i > sampleHeight - 1 || x + i < 0)
                    continue;
                var index = (y + j) * sampleWidth + (x + i);
                if (index >= totalLength)
                    continue;

                data[index] = Math.max(data[index], map[key]);
            }
        }
    }
    return data;
}
var createPlaneHeatMapFromXls = function (heatMapTest) {
    for (var i = 0; i < 5; i++) {
        var textureBuffer = createDataFromXls(1024, 1024);
        heatMapTest.createPlaneHeatMap(textureBuffer, 1024, 1024, [0, 0, i]);
    }
}

var createVolumeRenderingFromXls = function (heatMapTest) {
    var data = [];
    var levels = 5;
    for (var i = 0; i < levels; i++) {
        data.push(createDataFromXls(512, 512));
        if (i % 2 == 10) {
            for (var ii = 0; ii < 512; ii++) {
                for (var jj = 0; jj < ii; jj++) {
                    var index1 = ii * 512 + jj;
                    var index2 = jj * 512 + ii;
                    var temp = data[i][index1];
                    data[i][index1] = data[i][index2];
                    data[i][index2] = temp;
                }
            }
        }
    }
    heatMapTest.createVolumeRenderingFromTextureBuffers(data, 512, 512);
}

var createVolumeDataFromLevelInfo = function() {
    var data = [];
    var levelInfos = [];
    levelInfos[0] = [
        {
            unit: "1,2,3,4,5,6,7,8",
            regions: [{
                start: [0, 0],
                end: [16, 16]
            }]
        }
    ];
    levelInfos[1] = [
        {
            unit: "1,2,7,8",
            regions: [
                {
                    start: [0, 0],
                    end: [5, 16]
                },
                {
                    start: [5, 13],
                    end: [11, 16]
                }
            ]
        },
        {
            unit: "6",
            regions: [
                {
                    start: [5, 0],
                    end: [11, 3]
                }
            ]
        },
        {
            unit: "4,5",
            regions: [
                {
                    start: [11, 0],
                    end: [16, 10]
                }
            ]
        },
        {
            unit: "3",
            regions: [
                {
                    start: [11, 10],
                    end: [16, 16]
                }
            ]
        }
    ];
    levelInfos[2] = [
        {
            unit: "1",
            regions: [
                {
                    start: [0, 10],
                    end: [5, 16]
                }
            ]
        },
        {
            unit: "2",
            regions: [
                {
                    start: [5, 10],
                    end: [11, 16]
                }
            ]
        },
        {
            unit: "3",
            regions: [
                {
                    start: [11, 10],
                    end: [16, 16]
                }
            ]
        },
        {
            unit: "4",
            regions: [
                {
                    start: [11, 6],
                    end: [16, 10]
                }
            ]
        },
        {
            unit: "5",
            regions: [
                {
                    start: [11, 0],
                    end: [16, 6]
                }
            ]
        },
        {
            unit: "6",
            regions: [
                {
                    start: [0, 0],
                    end: [11, 4]
                }
            ]
        },
        {
            unit: "7",
            regions: [
                {
                    start: [0, 3],
                    end: [3, 6]
                }
            ]
        },
        {
            unit: "8",
            regions: [
                {
                    start: [0, 6],
                    end: [3, 10]
                }
            ]
        }
    ]

    levelInfos[3] = [
        {
            unit: "1",
            regions: [{
                start: [0, 10],
                end: [5, 16]
            }]
        },
        {
            unit: "2",
            regions: [{
                start: [5, 10],
                end: [11, 16]
            }]
        },
        {
            unit: "3",
            regions: [{
                start: [11, 10],
                end: [16, 16]
            }]
        },
        {
            unit: "4",
            regions: [{
                start: [11, 6],
                end: [16, 10]
            }]
        },
        {
            unit: "5",
            regions: [{
                start: [11, 0],
                end: [16, 6]
            }]
        },
        {
            unit: "6",
            regions: [{
                start: [5, 0],
                end: [11, 6]
            }]
        },
        {
            unit: "7",
            regions: [{
                start: [0, 0],
                end: [5, 6]
            }]
        },
        {
            unit: "8",
            regions: [{
                start: [0, 6],
                end: [5, 10]
            }]
        }
    ];

    levelInfos[4] = [
        {
            unit: "1",
            regions: [{
                start: [0, 10],
                end: [5, 16]
            }]
        },
        {
            unit: "2",
            regions: [{
                start: [5, 10],
                end: [9.5, 16]
            }]
        },
        {
            unit: "3",
            regions: [{
                start: [9.5, 10],
                end: [16, 16]
            }]
        },
        {
            unit: "4",
            regions: [{
                start: [9.5, 6],
                end: [16, 10]
            }]
        },
        {
            unit: "5",
            regions: [{
                start: [11, 0],
                end: [16, 6]
            }]
        },
        {
            unit: "6",
            regions: [{
                start: [5, 0],
                end: [11, 6]
            }]
        },
        {
            unit: "7",
            regions: [{
                start: [0, 0],
                end: [5, 4]
            }]
        },
        {
            unit: "8",
            regions: [{
                start: [0, 4],
                end: [5, 10]
            }]
        }
    ];

    var intensities = [[0.166, 0.166, 0.166, 0.166, 0.166, 0.166, 0.166, 0.166],
    [0.006, 0.006, 0, 0, 0, 0, 0.006, 0.006],
    [0.169, 0, 0.083, 0.27, 0.108, 0, 0, 0.09],
    [0.011, 0, 0, 0, 0, 0, 0, 0],
    [0, 0.154, 0.154, 0.154, 0.154, 0.154, 0.172, 0]
    ];

    var max = 0;
    for (var i=0;i<5;i++) {
        for (var j = 0; j< 8;j++) {
            if (max < intensities[i][j])
                max = intensities[i][j];
        }
    }
    for (var i=0;i<5;i++) {
        for (var j = 0; j< 8;j++) {
            intensities[i][j] = intensities[i][j] / max;
        }
    }

//     var intensities = [[0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
//     [0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4],
//     [0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.6],
//     [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
//     [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
// ];

    var centerRegion = {
        start: [3, 3.5],
        end: [13, 12.5]
    }
    
    data = [];
    var width = 512; height = 512;
    var empty = new Float32Array(512 * 512);
    levelInfos.forEach(function(levelInfo, idx1) {
        levelInfo.forEach(function(unitData,idx, dataArray) {
            var levels = unitData.unit.split(",");
            levels.forEach(function(level, index, array) {
                array[index] = parseInt(level);
            });
            dataArray[idx].value = intensities[idx1][levels[0] - 1];
        });

        var buffer = new Float32Array(width * height);
        for (var i = 0; i < width; i++) {
            for(var j = 0; j < height; j++) {
                var x = i / 32;
                var y = j / 32;
                for (var ii = 0; ii < levelInfo.length; ii++) {
                    for (var jj = 0; jj < levelInfo[ii].regions.length; jj++) {

                        if (x >= centerRegion.start[0]
                            &&x <= centerRegion.end[0]
                            &&y >= centerRegion.start[1]
                            &&y <= centerRegion.end[1]) {
                                buffer[i * width + j] = 0.0;
                                break;
                            }
                        if ( x >= levelInfo[ii].regions[jj].start[0] 
                            && x <= levelInfo[ii].regions[jj].end[0]
                            && y >= levelInfo[ii].regions[jj].start[1]
                            && y <= levelInfo[ii].regions[jj].end[1]) {
                                buffer[i * width + j] = levelInfo[ii].value;
                                break;
                            }
                    }
                }
            }
        }

        data.push(buffer);
    });

    return data;
}
var createVolumerendering2 = function (heatMapTest) {
    var data = createVolumeDataFromLevelInfo();
    heatMapTest.createVolumeRenderingFromTextureBuffers(data, 512, 512);
}

var distanceTransform = function(imageData) {
    var distanceField = [];
    for (var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            distanceField[i * 512 + j] = Infinity;
        }
    }

    for (var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            if (j == 0 || j == 511 || imageData[i * 512 + j] != imageData[i * 512 + j + 1]) {
                distanceField[i * 512 + j] = 0;
            }
        }
    }

    for (var j = 0; j < 512; j++) {
        for (var i = 0; i < 512; i++) {
            if (i == 0 || i == 511 || imageData[i * 512 + j] != imageData[(i+1) * 512 +j]) {
                distanceField[i * 512 + j] = 0;
            }
        }
    }

    for (var i = 0; i < 512; i++) {
        for (var j = 1; j < 511; j++) {
            distanceField[i * 512 + j] = Math.min(distanceField[i * 512 + j - 1] + 1, distanceField[i * 512 + j]); 
        }
        for (var j = 510; j > 0; j--) {
            distanceField[i * 512 + j] = Math.min(distanceField[i * 512 + j + 1] + 1, distanceField[i * 512 + j])
        }
    }
    for (var j = 0; j < 512; j++) {
        for (var i = 1; i < 511; i++) {
            distanceField[i * 512 + j] = Math.min(distanceField[(i - 1) * 512 + j] + 1, distanceField[i * 512 + j]);
        }
        for (var i = 510; i > 0; i --) {
            distanceField[i * 512 + j] = Math.min(distanceField[(i + 1) * 512 + j] + 1, distanceField[i * 512 + j]);
        }
    }

    var centerRegion = {
        start: [3, 3.5],
        end: [13, 12.5]
    }

    for (var i = 0; i < 512; i++) {
        for(var j = 0; j < 512; j++) {
            var x = i / 32;
            var y = j / 32;
            if (x >= centerRegion.start[0]
                && x <= centerRegion.end[0]
                && y >= centerRegion.start[1]
                && y <= centerRegion.end[1]) {
                    distanceField[i * 512 + j] = 0.0;
            }

        }
    }

    var max = -1;
    for (var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            var index = i * 512 + j;
            if (distanceField[index] > max) {
                max = distanceField[index];
            }
        }
    }
 
    for(var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            var index = i * 512 + j;
            imageData[index] = distanceField[index] / max;
        }
    }

    return;
    var bitmask = new Uint8Array(512 * 512);

    var indices = [];
    var traverseData = function(i , j) {
        var index = i * 512 + j;
        bitmask[index] = 1;
        var value = imageData[index];
        var iSeed = -1;
        var jSeed = -1;
        for(var ii = -1; ii < 2; ii++) {
            for (var jj = -1; jj < 2; jj++) {
 
                var nextIndex = (i + ii) * 512 + j + jj;      
                if (ii==0 && jj == 0) {
                    indices.push(nextIndex);
                    continue;
                }
                if (nextIndex >=0 && nextIndex < 262144 && !bitmask[nextIndex] && imageData[nextIndex] === value) {
                    bitmask[nextIndex] = 1;
                    indices.push(nextIndex);
                    if (max < distanceField[nextIndex]) {
                        max = distanceField[nextIndex];
                    }
                    iSeed = i + ii;
                    jSeed = j + jj;
                }
            }
        }
        if (iSeed != -1) {
            traverseData(iSeed, jSeed);
        }
    }

    for(var i = 0; i < 512; i++) {
        for(var j = 0; j < 512; j++) {
            if (imageData[i * 512 + j] > 0) {
                if (bitmask[i * 512 + j])
                    continue;
                    
                
                indices = [];
                max = -1;
                traverseData(i, j);
                if (max == -1)
                    continue;
                indices.forEach(function(index) {
                    imageData[index] = imageData[index] * distanceField[index] / max;
                })
            }
        }
    }
}

var createVolumeRenderingDF = function(heatMapTest) {
    var data = createVolumeDataFromLevelInfo();
    for(var i = 0; i < data.length; i++) {
        var imageData = data[i];
        distanceTransform(imageData);
    }
    heatMapTest.createVolumeRenderingFromTextureBuffers(data, 512, 512);
}

var euclideanDistanceTransform = function(imageData) {
    var distanceFieldX = new Uint16Array(512 * 512);
    var distanceFieldY = new Uint16Array(512 * 512);
    var distanceField = new Uint16Array(512 * 512);

    for (var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            var index = i * 512 + j;
            distanceFieldX[index] = 65535;
            distanceFieldY[index] = 65535;
        }
    }

    for (var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            var index = i * 512 + j;
            if ( j == 0 || j == 511 || i == 0 || i == 511) {
                distanceFieldX[index] = 0;
                distanceFieldY[index] = 0;
                continue;
            }
            if (imageData[i * 512 +j] != imageData[i * 512 + j + 1] || imageData[i * 512 +j] != imageData[(i + 1) * 512 +j]) {
                distanceFieldX[index] = 0;
                distanceFieldY[index] = 0;
            }
        }
    }

    var centerRegion = {
        start: [3, 3.5],
        end: [13, 12.5]
    }

    for (var i = 0; i < 512; i++) {
        for(var j = 0; j < 512; j++) {
            var x = i / 32;
            var y = j / 32;
            if (x >= centerRegion.start[0]
                && x <= centerRegion.end[0]
                && y >= centerRegion.start[1]
                && y <= centerRegion.end[1]) {
                    distanceFieldX[i * 512 + j] = 0.0;
                    distanceFieldY[i * 512 + j] = 0.0;
            }

        }
    }

    for (var i = 0; i < 512; i++) {
        for (var j = 1; j < 511; j++) {
            var index = i * 512 + j;
            distanceFieldX[index] = Math.min(distanceFieldX[index], distanceFieldX[i * 512 + j - 1] + 1);
        }
        for (var j = 510; j >= 0; j--) {
            var index = i * 512 + j;
            distanceFieldX[index] = Math.min(distanceFieldX[index], distanceFieldX[i * 512 + j + 1] + 1);
        }
    }

    for (var j = 0; j < 512; j++) {
        for (var i = 1; i < 511; i++) {
            var index = i * 512 + j;
            distanceFieldY[index] = Math.min(distanceFieldY[index], distanceFieldY[(i - 1) * 512 + j] + 1);
        }
        for (var i = 510; i >= 0; i--) {
            var index = i * 512 + j;
            distanceFieldY[index] = Math.min(distanceFieldY[index], distanceFieldY[(i + 1) * 512 + j] + 1);
        }
    }

    var centerRegion = {
        start: [3, 3.5],
        end: [13, 12.5]
    }

    for (var i = 0; i < 512; i++) {
        for(var j = 0; j < 512; j++) {
            var x = i / 32;
            var y = j / 32;
            if (x >= centerRegion.start[0]
                && x <= centerRegion.end[0]
                && y >= centerRegion.start[1]
                && y <= centerRegion.end[1]) {
                    distanceFieldX[i * 512 + j] = 0.0;
                    distanceFieldY[i * 512 + j] = 0.0;
            }

        }
    }

    for (var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            var index = i * 512 + j;
            // distanceField[index] = Math.sqrt(distanceFieldX[index] * distanceFieldX[index] + distanceFieldY[index] * distanceFieldY[index]);
            distanceField[index] = Math.min(distanceFieldX[index], distanceFieldY[index]);

            if (i > 0 && i < 96) {
                if ((j > 0 && j < 112)) {
                    var x = i - 96;
                    var y = j - 112;
                    distanceField[index] = Math.min(Math.sqrt(x * x + y * y), distanceField[index]);
                }

                if ((j > 400 && j < 456)) {
                    var x = i - 96;
                    var y = j - 400;
                    distanceField[index] = Math.min(Math.sqrt(x * x + y * y), distanceField[index]);
                }
            }

            if (i > 416 && i < 512) {
                if ((j > 56 && j < 112)) {
                    var x = i - 416;
                    var y = j - 112;
                    distanceField[index] = Math.min(Math.sqrt(x * x + y * y), distanceField[index]);
                }

                if ((j > 400 && j < 512)) {
                    var x = i - 416;
                    var y = j - 400;
                    distanceField[index] = Math.min(Math.sqrt(x * x + y * y), distanceField[index]);
                }
            }
        }
    }

    var max = -1;
    for (var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            var index = i * 512 + j;
            if (distanceField[index] > max) {
                max = distanceField[index];
            }
        }
    }

    for (var i = 0; i < 512; i++) {
        for (var j = 0; j < 512; j++) {
            var index = i * 512 + j;
            imageData[index] = imageData[index] * distanceField[index] / max;
        }
    }

    // var bitmask = new Uint8Array(512 * 512);

    // var indices = [];
    // var traverseData = function(i , j) {
    //     var index = i * 512 + j;
    //     bitmask[index] = 1;
    //     indices.push(index);
    //     var value = imageData[index];
    //     var iSeed = -1;
    //     var jSeed = -1;
    //     for(var ii = -1; ii < 2; ii++) {
    //         for (var jj = -1; jj < 2; jj++) {
 
    //             var nextIndex = (i + ii) * 512 + j + jj;      
    //             if (ii==0 && jj == 0) {
    //                 continue;
    //             }
    //             if (nextIndex >=0 && nextIndex < 262144 && !bitmask[nextIndex] && imageData[nextIndex] === value) {
    //                 bitmask[nextIndex] = 1;
    //                 indices.push(nextIndex);
    //                 if (max < distanceField[nextIndex]) {
    //                     max = distanceField[nextIndex];
    //                 }
    //                 iSeed = i + ii;
    //                 jSeed = j + jj;
    //             }
    //         }
    //     }
    //     if (iSeed != -1) {
    //         traverseData(iSeed, jSeed);
    //     }
    // }

    // for(var i = 1; i < 511; i++) {
    //     for(var j = 1; j < 511; j++) {
    //         if (imageData[i * 512 + j] > 0) {
    //             if (bitmask[i * 512 + j])
    //                 continue;
                    
    //             indices = [];
    //             max = -1;
    //             traverseData(i, j);
    //             if (max == -1)
    //                 continue;
    //             indices.forEach(function(index) {
    //                 imageData[index] = 1.0;//imageData[index] * distanceField[index] / max;
    //             })
    //         }
    //         return;
    //     }
    // }
}

var createVolumerendering3 = function(heatMapTest) {
    var data = createVolumeDataFromLevelInfo();
    var max = -1;
    data.forEach(function(imageData) {
        euclideanDistanceTransform(imageData);
        for(var i = 0; i < 512; i++) {
            for (var j = 0; j < 512; j++) {
                if (max < imageData[i * 512 + j]) {
                    max = imageData[i * 512 + j];
                }
            }
        }
    })

    data.forEach(function(imageData) {
        for(var i = 0; i < 512; i++) {
            for (var j = 0; j < 512; j++) {
                imageData[i * 512 + j] /= max;
            }
        }
    })

    heatMapTest.createVolumeRenderingFromTextureBuffers(data, 512, 512);
}

var createVolumeRendering4 = function(heatMapTest) {
    heatMapTest.createVolumeRenderingFromTextureBuffers(null, 512, 512);
}

var unitData = [];
for(var i = 0; i < 64; i++) {
    var data = {
        "1": 0.8,
        "2": 0.3,
        "3": 0.2,
        "4": 1.0,
        "5": 0.7,
        "6": 0.5,
        "7": 0.2,
        "8": 1.0,
        "9": 1.0,
        "10": 1.0
    }

    unitData.push(data);
}
var createVolumeRendering5 = function(heatMapTest) {
    // heatMapTest.createVolumeRenderingFromTextures("./volumeMap.png", "./floorMap.png", unitData);
    heatMapTest.createVolumeRenderingFromTextures("./volumeMap-full.png", "./floorMap-full.png", unitData);
}

Modelo.Auth.signIn(appToken,
    null,
    function () {
        var c = document.getElementById("model");
        var viewer = new Modelo.View.Viewer3D(c, false, 1200, 800);
        // var viewer = new Modelo.View.Viewer3D(c, false, 4096, 4096);

        viewer.createScene(function () {
            console.log("create scene successfully");
            viewer.addInput(new Modelo.View.Input.Mouse(c)); // Add mouse to control camera.
            var keyboard = new Modelo.View.Input.Keyboard(c); // Add keyboard callback.
            viewer.addInput(keyboard);
            keyboard.addKeyUpListener(function (keyboard) {
                if (keyboard.key === 27) {
                    viewer.destroy();
                }
            });
        });

        var heatMapTest = viewer.createHeatMapTest();
        // createPlaneHeatMap(heatMapTest);
        // createSlab(heatMapTest);
        // createHeightMap(heatMapTest);
        // createVolumeRendering(heatMapTest);
        // createPlaneHeatMapFromXls(heatMapTest);
        // createVolumeRenderingFromXls(heatMapTest);
        // createVolumerendering2(heatMapTest);
        // createVolumeRenderingDF(heatMapTest);
        // createVolumerendering3(heatMapTest);
        // createVolumeRendering4(heatMapTest);
        createVolumeRendering5(heatMapTest);

        // viewer.setVolumeRenderingAlphaCorrection(0.05);

        viewer._scene.core.bbox = new Float32Array([-10, -10, -10, 10, 10, 10]);
        viewer._scene.core.radius = 3;
        viewer.getCamera().switchToView(Modelo.View.ViewAngle.WORLD);

        document.getElementById("intensity-as-alpha").onchange = function (evt) {
            viewer.setVolumeRenderingIntensityAsAlpha(document.getElementById("intensity-as-alpha").checked);
        };

        document.getElementById("texture").onchange = function (evt) {
            viewer.toggleTextureViewer();
        };

        document.getElementById("background-blend").onchange = function () {
            viewer.setVolumeRenderingBlendWithBackground(document.getElementById("background-blend").checked);
        }

        $('#alphaRange').range({
            min: 0.01,
            max: 0.5,
            start: 0.01,
            step: 0.001,
            onChange: function (value) {
                viewer.setVolumeRenderingAlphaCorrection(value);
            }
        });

        var _this = this;

        _this.toneMap = [
            [0, 0, 255, 10],
            [0, 255, 255, 20],
            [0, 255, 0, 200],
            [255, 255, 0, 200],
            [255, 0, 0, 255]
        ];
        var buffer = new Uint8Array(8 * 4);
        var updateToneMap = function () {
            for (var i = 0; i < _this.toneMap.length; i++) {
                buffer[i * 4] = _this.toneMap[i][0];
                buffer[i * 4 + 1] = _this.toneMap[i][1];
                buffer[i * 4 + 2] = _this.toneMap[i][2];
                buffer[i * 4 + 3] = _this.toneMap[i][3];
            }
            // viewer.setVolumeRenderingColorMap(buffer);
        }

        $('#colorMap0').css("background-color", "rgb(" + _this.toneMap[0][0] + "," + _this.toneMap[0][1] + "," + _this.toneMap[0][2] + ")");
        $('#colorMap1').css("background-color", "rgb(" + _this.toneMap[1][0] + "," + _this.toneMap[1][1] + "," + _this.toneMap[1][2] + ")");
        $('#colorMap2').css("background-color", "rgb(" + _this.toneMap[2][0] + "," + _this.toneMap[2][1] + "," + _this.toneMap[2][2] + ")");
        $('#colorMap3').css("background-color", "rgb(" + _this.toneMap[3][0] + "," + _this.toneMap[3][1] + "," + _this.toneMap[3][2] + ")");
        $('#colorMap4').css("background-color", "rgb(" + _this.toneMap[4][0] + "," + _this.toneMap[4][1] + "," + _this.toneMap[4][2] + ")");

        $('#colorMap0').ColorPicker({
            onChange: function (hsb, hex, rgb) {
                _this.toneMap[0][0] = rgb.r;
                _this.toneMap[0][1] = rgb.g;
                _this.toneMap[0][2] = rgb.b;
                $('#colorMap0').css("background-color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
                updateToneMap();
            }
        });
        $('#colorMap1').ColorPicker({
            onChange: function (hsb, hex, rgb) {
                _this.toneMap[1][0] = rgb.r;
                _this.toneMap[1][1] = rgb.g;
                _this.toneMap[1][2] = rgb.b;
                $('#colorMap1').css("background-color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
                updateToneMap();
            }
        });
        $('#colorMap2').ColorPicker({
            onChange: function (hsb, hex, rgb) {
                _this.toneMap[2][0] = rgb.r;
                _this.toneMap[2][1] = rgb.g;
                _this.toneMap[2][2] = rgb.b;
                $('#colorMap1').css("background-color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
                updateToneMap();
            }
        });
        $('#colorMap3').ColorPicker({
            onChange: function (hsb, hex, rgb) {
                _this.toneMap[3][0] = rgb.r;
                _this.toneMap[3][1] = rgb.g;
                _this.toneMap[3][2] = rgb.b;
                $('#colorMap3').css("background-color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
                updateToneMap();
            }
        });
        $('#colorMap4').ColorPicker({
            onChange: function (hsb, hex, rgb) {
                _this.toneMap[4][0] = rgb.r;
                _this.toneMap[4][1] = rgb.g;
                _this.toneMap[4][2] = rgb.b;
                $('#colorMap4').css("background-color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
                updateToneMap();
            }
        });

        $('#alpha0').range({
            min: 0,
            max: 255,
            start: _this.toneMap[0][3],
            step: 1,
            onChange: function (value) {
                _this.toneMap[0][3] = value;
                updateToneMap();
            }
        });

        $('#alpha1').range({
            min: 0,
            max: 255,
            start: _this.toneMap[1][3],
            step: 1,
            onChange: function (value) {
                _this.toneMap[1][3] = value;
                updateToneMap();
            }
        });

        $('#alpha2').range({
            min: 0,
            max: 255,
            start: _this.toneMap[2][3],
            step: 1,
            onChange: function (value) {
                _this.toneMap[2][3] = value;
                updateToneMap();
            }
        });

        $('#alpha3').range({
            min: 0,
            max: 255,
            start: _this.toneMap[3][3],
            step: 1,
            onChange: function (value) {
                _this.toneMap[3][3] = value;
                updateToneMap();
            }
        });

        $('#alpha4').range({
            min: 0,
            max: 255,
            start: _this.toneMap[4][3],
            step: 1,
            onChange: function (value) {
                _this.toneMap[4][3] = value;
                updateToneMap();
            }
        });
    },
    function (errmsg) {
        console.log(errmsg); // If there is any sign-inerror.
    });



    // 51 * 42.2 * 4.2
