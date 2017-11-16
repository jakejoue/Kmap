goog.provide('KMap.Transform');

goog.require('KMap');

/**
 * 常用的商用坐标系和WGS84,3857之间的转换
 * @constructor
 * @api
 */
KMap.Transform = function () {
    this.PI = 3.14159265358979324;
    this.x_pi = 3.14159265358979324 * 3000.0 / 180.0;

    this.BDMC = {
        EARTHRADIUS: 6370996.81,
        MCBAND: [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
        LLBAND: [75, 60, 45, 30, 15, 0],
        MC2LL: [[1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2], [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86], [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37], [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06], [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4], [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5]],
        LL2MC: [[-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5], [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5], [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5], [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5], [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5], [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]],
        getDistanceByMC: function (cQ, cO) {
            if (!cQ || !cO) {
                return 0;
            }
            var cM, cP, T, cN;
            cQ = this.convertMC2LL(cQ);
            if (!cQ) {
                return 0;
            }
            cM = this.toRadians(cQ.lng);
            cP = this.toRadians(cQ.lat);
            cO = this.convertMC2LL(cO);
            if (!cO) {
                return 0;
            }
            T = this.toRadians(cO.lng);
            cN = this.toRadians(cO.lat);
            return this.getDistance(cM, T, cP, cN);
        },
        getDistanceByLL: function (cQ, cO) {
            if (!cQ || !cO) {
                return 0;
            }
            cQ.lng = this.getLoop(cQ.lng, -180, 180);
            cQ.lat = this.getRange(cQ.lat, -74, 74);
            cO.lng = this.getLoop(cO.lng, -180, 180);
            cO.lat = this.getRange(cO.lat, -74, 74);
            var cM, T, cP, cN;
            cM = this.toRadians(cQ.lng);
            cP = this.toRadians(cQ.lat);
            T = this.toRadians(cO.lng);
            cN = this.toRadians(cO.lat);
            return this.getDistance(cM, T, cP, cN);
        },
        convertMC2LL: function (cM) {
            var cN, cP;
            cN = new ce(Math.abs(cM.lng), Math.abs(cM.lat));
            for (var cO = 0; cO < this.MCBAND.length; cO++) {
                if (cN.lat >= this.MCBAND[cO]) {
                    cP = this.MC2LL[cO];
                    break;
                }
            }
            var T = this.convertor(cM, cP);
            cM = new ce(T.lng/*.toFixed(6)*/, T.lat/*.toFixed(6)*/);
            return cM;
        },
        convertLL2MC: function (T) {
            var cM, cO;
            T.lng = this.getLoop(T.lng, -180, 180);
            T.lat = this.getRange(T.lat, -74, 74);
            cM = new ce(T.lng, T.lat);
            for (var cN = 0; cN < this.LLBAND.length; cN++) {
                if (cM.lat >= this.LLBAND[cN]) {
                    cO = this.LL2MC[cN];
                    break;
                }
            }
            if (!cO) {
                for (var cN = this.LLBAND.length - 1; cN >= 0; cN--) {
                    if (cM.lat <= -this.LLBAND[cN]) {
                        cO = this.LL2MC[cN];
                        break;
                    }
                }
            }
            var cP = this.convertor(T, cO);
            T = new ce(cP.lng/*.toFixed(2)*/, cP.lat/*.toFixed(2)*/);
            return T;
        },
        convertor: function (cN, cO) {
            if (!cN || !cO) {
                return;
            }
            var T = cO[0] + cO[1] * Math.abs(cN.lng);
            var cM = Math.abs(cN.lat) / cO[9];
            var cP = cO[2] + cO[3] * cM + cO[4] * cM * cM + cO[5] * cM * cM * cM + cO[6] * cM * cM * cM * cM + cO[7] * cM * cM * cM * cM * cM + cO[8] * cM * cM * cM * cM * cM * cM; T *= (cN.lng < 0 ? -1 : 1); cP *= (cN.lat < 0 ? -1 : 1);
            return new ce(T, cP);
        },
        getDistance: function (cM, T, cO, cN) {
            return this.EARTHRADIUS * Math.acos((Math.sin(cO) * Math.sin(cN) + Math.cos(cO) * Math.cos(cN) * Math.cos(T - cM)));
        },
        toRadians: function (T) {
            return Math.PI * T / 180;
        },
        toDegrees: function (T) {
            return (180 * T) / Math.PI;
        },
        getRange: function (cN, cM, T) {
            if (cM != null) {
                cN = Math.max(cN, cM);
            }
            if (T != null) {
                cN = Math.min(cN, T);
            }
            return cN;
        },
        getLoop: function (cN, cM, T) {
            while (cN > T) {
                cN -= T - cM;
            }
            while (cN < cM) {
                cN += T - cM;
            }
            return cN;
        }
    };
};

KMap.Transform.prototype.delta = function (lat, lon) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
    var dLat = this.transformLat(lon - 105.0, lat - 35.0);
    var dLon = this.transformLon(lon - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * this.PI;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
    return { 'lat': dLat, 'lon': dLon };
};

/**
 * WGS-84 to GCJ-02
 * 
 * @param {number} wgsLat 
 * @param {number} wgsLon 
 * @returns {Object}
 * @api
 */
KMap.Transform.prototype.gcj_encrypt = function (wgsLat, wgsLon) {
    if (this.outOfChina(wgsLat, wgsLon))
        return { 'lat': wgsLat, 'lon': wgsLon };

    var d = this.delta(wgsLat, wgsLon);
    return { 'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon };
};
/**
 * GCJ-02 to WGS-84
 * 
 * @param {number} gcjLat 
 * @param {number} gcjLon 
 * @returns {Object}
 * @api
 */
KMap.Transform.prototype.gcj_decrypt = function (gcjLat, gcjLon) {
    if (this.outOfChina(gcjLat, gcjLon))
        return { 'lat': gcjLat, 'lon': gcjLon };

    var d = this.delta(gcjLat, gcjLon);
    return { 'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon };
};
/**
 * GCJ-02 to WGS-84 exactly
 * 
 * @param {number} gcjLat 
 * @param {number} gcjLon 
 * @returns {Object}
 * @api
 */
KMap.Transform.prototype.gcj_decrypt_exact = function (gcjLat, gcjLon) {
    var initDelta = 0.01;
    var threshold = 0.000000001;
    var dLat = initDelta, dLon = initDelta;
    var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
    var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
    var wgsLat, wgsLon, i = 0;
    while (1) {
        wgsLat = (mLat + pLat) / 2;
        wgsLon = (mLon + pLon) / 2;
        var tmp = this.gcj_encrypt(wgsLat, wgsLon)
        dLat = tmp.lat - gcjLat;
        dLon = tmp.lon - gcjLon;
        if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
            break;

        if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
        if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

        if (++i > 10000) break;
    }
    //console.log(i);
    return { 'lat': wgsLat, 'lon': wgsLon };
};
/**
 * GCJ-02 to BD-09
 * 
 * @param {number} gcjLat 
 * @param {number} gcjLon 
 * @returns {Object}
 */
KMap.Transform.prototype.bd_encrypt = function (gcjLat, gcjLon) {
    var x = gcjLon, y = gcjLat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    var bdLon = z * Math.cos(theta) + 0.0065;
    var bdLat = z * Math.sin(theta) + 0.006;
    return { 'lat': bdLat, 'lon': bdLon };
};
/**
 * BD-09 to GCJ-02
 * 
 * @param {number} bdLat 
 * @param {number} bdLon 
 * @returns {Object}
 */
KMap.Transform.prototype.bd_decrypt = function (bdLat, bdLon) {
    var x = bdLon - 0.0065, y = bdLat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
    var gcjLon = z * Math.cos(theta);
    var gcjLat = z * Math.sin(theta);
    return { 'lat': gcjLat, 'lon': gcjLon };
};
/**
 * BD-09 to BD-MC
 * 
 * @param {number} bdLat 
 * @param {number} bdLon 
 * @returns {Object}
 */
KMap.Transform.prototype.bdmc_encrypt = function (bdLat, bdLon) {
    var mc = this.BDMC.convertLL2MC(new ce(bdLon, bdLat));
    return { 'lat': mc.lat, 'lon': mc.lng };
};
/**
 * BD-MC to BD-09
 * 
 * @param {number} mcLat 
 * @param {number} mcLon 
 * @returns {Object}
 */
KMap.Transform.prototype.bdmc_decrypt = function (mcLat, mcLon) {
    var bd = this.BDMC.convertMC2LL(new ce(mcLon, mcLat));
    return { 'lat': bd.lat, 'lon': bd.lng };
};
/**
 * WGS-84 to Web mercator
 * mercatorLat -> y mercatorLon -> x
 * @param {number} wgsLat 
 * @param {number} wgsLon 
 * @returns {Object}
 */
KMap.Transform.prototype.mercator_encrypt = function (wgsLat, wgsLon) {
    var x = wgsLon * 20037508.34 / 180.;
    var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
    y = y * 20037508.34 / 180.;
    return { 'lat': y, 'lon': x };
};
/**
 * Web mercator to WGS-84
 * mercatorLat -> y mercatorLon -> x
 * @param {number} mercatorLat 
 * @param {number} mercatorLon 
 * @returns {Object}
 */
KMap.Transform.prototype.mercator_decrypt = function (mercatorLat, mercatorLon) {
    var x = mercatorLon / 20037508.34 * 180.;
    var y = mercatorLat / 20037508.34 * 180.;
    y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
    return { 'lat': y, 'lon': x };
};
/**
 * two point's distance
 * @api
 */
KMap.Transform.prototype.distance = function (latA, lonA, latB, lonB) {
    var earthR = 6371000.;
    var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
    var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
    var s = x + y;
    if (s > 1) s = 1;
    if (s < -1) s = -1;
    var alpha = Math.acos(s);
    var distance = alpha * earthR;
    return distance;
};
KMap.Transform.prototype.outOfChina = function (lat, lon) {
    if (lon < 72.004 || lon > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;
    return false;
};
KMap.Transform.prototype.transformLat = function (x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
    return ret;
};
KMap.Transform.prototype.transformLon = function (x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
    return ret;
};

/**
 * @constructor
 */
function ce(lng, lat) {
    if (isNaN(lng)) {
        lng = ce.bW(lng);
        lng = isNaN(lng) ? 0 : lng
    }
    if (ce.b4(lng)) {
        lng = parseFloat(lng)
    }
    if (isNaN(lat)) {
        lat = ce.bW(lat); lat = isNaN(lat) ? 0 : lat
    }
    if (ce.b4(lat)) {
        lat = parseFloat(lat)
    }

    this.lng = lng;
    this.lat = lat;
}
ce.bW = function (cO) {
    var cM = "";
    var cV, cT, cR = "";
    var cU, cS, cQ, cP = "";
    var cN = 0;
    var T = /[^A-Za-z0-9\+\/\=]/g;
    if (!cO || T.exec(cO)) {
        return cO;
    }
    cO = cO.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    var cg = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    do {
        cU = cg.indexOf(cO.charAt(cN++));
        cS = cg.indexOf(cO.charAt(cN++));
        cQ = cg.indexOf(cO.charAt(cN++));
        cP = cg.indexOf(cO.charAt(cN++));
        cV = (cU << 2) | (cS >> 4);
        cT = ((cS & 15) << 4) | (cQ >> 2);
        cR = ((cQ & 3) << 6) | cP;
        cM = cM + String.fromCharCode(cV);
        if (cQ != 64) {
            cM = cM + String.fromCharCode(cT);
        }
        if (cP != 64) {
            cM = cM + String.fromCharCode(cR);
        }
        cV = cT = cR = "";
        cU = cS = cQ = cP = ""
    } while (cN < cO.length);
    return cM;
};
ce.b4 = function (T) {
    return typeof T == "string";
};
ce.isInRange = function (T) {
    return T && T.lng <= 180 && T.lng >= -180 && T.lat <= 74 && T.lat >= -74;
};
ce.prototype.equals = function (T) {
    return T && this.lat == T.lat && this.lng == T.lng;
};