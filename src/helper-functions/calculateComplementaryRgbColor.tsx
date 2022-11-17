export default function calculateComplementaryRgbColor(color: string)
{
    let hex = '#' + color.slice(4,-1).split(',').map(x => (+x).toString(16).padStart(2,'0')).join('')
    // Implementation taken from https://stackoverflow.com/questions/40061256/javascript-complementary-colors.
    let c = hex.slice(1),
        i = parseInt(c, 16),
        v = ((1 << 4 * c.length) - 1 - i).toString(16);

    while (v.length < c.length) {
        v = '0' + v;
    }
    return '#' + v;
}