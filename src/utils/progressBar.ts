import Bar from 'progress'

export const generateProgressBar = (title: string, total: number | any[]) => {
    total = typeof total === 'number' ? total : total.length
    const bar = new Bar(`${title} 「:total」- [:bar] :rate/bps :percent :elapseds`, { complete: '|', total: total, width: 50 })
    bar.render()
    return bar
}