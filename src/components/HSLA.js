const HSLA = function (h = 0, s = 100, l = 50, a = 1) {

    const COLOR = {
        h: h,
        s: s,
        l: l,
        a: a
    };
    const OUTPUT = 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';

    function getColor() {
        return 'hsla(' + COLOR.h + ',' + COLOR.s + '%,' + COLOR.l + '%,' + COLOR.a + ')';
    }

    class HSLA {
        get() {
            return getColor();
        }
        set(h = 0, s = 100, l = 50, a = 1) {
            COLOR.h = h;
            COLOR.s = s;
            COLOR.l = l;
            COLOR.a = a;
            return getColor();
        }
        darken(value = 0) {
            COLOR.l += value;
            return getColor();
        }
        saturates(value) {
            COLOR.s += value;
            return getColor();
        }
        opacity(value) {
            COLOR.a += value;
            return getColor();
        }
    }

    return new HSLA();
}

export default HSLA;