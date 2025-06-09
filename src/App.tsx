import {useEffect, useState} from 'react'
import './App.css'
import {Slider} from "@/components/ui/slider.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import {AccordionHeader} from "@radix-ui/react-accordion";
import {Textarea} from "@/components/ui/textarea.tsx";

function App() {
    const [text, setText] = useState('タレントがその私生活を自分からマスメディアに公表することは、いまではまったく珍しくなくなった。これまでマスメディアに私生活を暴露され憤慨してきた彼らが、自らの結婚や離婚、病気などについて、自分からファクスでマスメディア に連絡する。もちろん一般の人びとにとっては、知らされてもほとんど関係ない話ばかりである。彼らの行動を自己宣伝や売名行為ととらえて眉をひそめる人も少なからずいる。一方でプライバシー保護を訴えておきながら、都合のいいときだけ私生活をさらけ出そうとする、というわけだ。だが別のとらえ方はこうである。彼らは先手を打とうとしているのだ。マスメディアに勝手に詮索され、おもしろおかしく記事にされる前に、自分の方から情報公開してその出ばなをくじこうという、いわば他人による勝手な物語化に対する予防措置である。マスメディアによって自分のイメージをつくられてしまいそうな人びとにとって、自分自身の情報を自らコントロールすることの重要度は高い。そうしなければ、他人によって勝手な&lt;私>、自らの物語的分身、すなわちファンタジー・ダブルがつくられて、社会を独り歩きし始めることになりかねないからだ。そのためにマスメディアを利用しようとするのである。昨今、人びとはマスメディアに対抗する強力な情報発信ツールを手に入れた。それはインターネットであり、またそれを活用したウェブサイトやブログである。人びとはそれらによってさまざまな自分の活動、知識や趣味、日常生活、そしてときには心境や悩みなどまで公表するようになった。&lt;私づくり>の主導権を確保するうえでは、画期的な手段である。実際の効果がどの程度かはわからない。だがイメージづくりのイニシアティヴをマスメディアに握られていた人びとにとって、自力で公に情報発信する有力な手段を手に入れたことに変わりはないだろう。人びとは、今度は自らの手でつくった自分自身の物語(ファンタジー・ダブル)を世に出そうとする。これはごく一部の人びとの話だと思われるかもしれない。だがこのことからは、一般的にプライバシーがどのように私たちの自己とかかわっているかをはっきり見て取ることができる。彼らに限らず、一般的にプライバシーとはく私づくり>のイニシアティヴの問題である。近代社会では、このイニシアティヴは基本的に各個人にあるとされてきた。自分自身がどのような人間になるか、そしてどのように生きるかは、その人自身の主体的な意思や選択にゆだねられる。これは個人の人権の一つとされてきたのである。だがこの権利が奪われ、他人が勝手に個人の自己=&lt;私>をつくろうとし始めるとき、私たちはプライバシー侵害を訴える。そして何とかく私づくり>のイニシアティヴを自らのもとに引き戻そうとする。')
    const [currentWord, setCurrentWord] = useState('')
    const [charactersPerHour, setCharactersPerHour] = useState(20000)
    const [start, setStart] = useState(false)

    useEffect(() => {
        if("Intl" in window === false || !('Segmenter' in Intl))
            return console.error('Intl.Segmenter is not supported in this browser.');

        const segmenter = new Intl.Segmenter('ja', {granularity: 'word'})
        const parsedText = segmenter.segment(text)
        const words = Array.from(parsedText, segment => segment.segment)

        setCurrentWord(words[0])
    }, [text]);

    useEffect(() => {
            if (!start) return;

            const segmenter = new Intl.Segmenter('ja', {granularity: 'word'})
            const parsedText = segmenter.segment(text)
            const words = Array.from(parsedText, segment => segment.segment)

            let index = 0;
            const interval = setInterval(() => {
                if (index < words.length) {
                    setCurrentWord(words[index]);
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, (3600 / charactersPerHour) * 1000);

            return () => clearInterval(interval);
        }, [start, text, charactersPerHour]);

    function resetText() {
        const segmenter = new Intl.Segmenter('ja', {granularity: 'word'})
        const parsedText = segmenter.segment(text)
        const words = Array.from(parsedText, segment => segment.segment)

        setCurrentWord(words[0]);
    }

  return (
      <div className="App flex flex-col justify-center gap-12 max-w-4xl w-full p-8">
          <h1>Experimentador de velocidad de lectura en japonés</h1>
          <p>
              ¿Quieres experimentar como es leer a una velocidad determinada en japonés? ¡Esta es tu página! Puedes modificar el texto, la velocidad de lectura y al darle a "Iniciar", las palabras empezarán a aparecer a la velocidad que hayas seleccionado. Puedes pausar y reiniciar cuando quieras.
          </p>
          <p className="text-4xl flex justify-center items-center gap-4">
            <span>{currentWord}</span>
          </p>
          <div className="flex flex-col items-center gap-4">
              <p className="text-2xl">Velocidad de lectura</p>
              <Slider defaultValue={[20000]} max={50000} min={1000} step={1000} onValueChange={(value) => setCharactersPerHour(value[0])} />
              <p className="text-lg">Caracteres por hora: {charactersPerHour}</p>
          </div>
          <div className="flex gap-2 text-white justify-center">
              {start ? (
                  <button onClick={()=>{
                        setStart(false);
                        resetText();
                  }}>
                      Parar
                  </button>
                ) : (
                  <button onClick={()=>setStart(true)}>
                      Iniciar
                  </button>
                )}
          </div>
          <Accordion type="single" collapsible className="text-white">
              <AccordionItem value="item-1">
                  <AccordionTrigger>Modificar texto</AccordionTrigger>
                  <AccordionHeader>Texto</AccordionHeader>
                  <AccordionContent>
                      <Textarea className="w-full h-64 text-black" value={text} onChange={(e) => setText(e.target.value)} />
                  </AccordionContent>
              </AccordionItem>
          </Accordion>
        </div>
  )
}

export default App
