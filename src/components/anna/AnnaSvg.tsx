import { useId } from 'react'
import { ICON_PATHS, ICON_SHAPES } from '../logo/iconGeometry'

const C = {
  skin: '#f3d5c2',
  skinShade: '#e2b49c',
  hair: '#c9a36e',
  hairShade: '#a7814f',
  hairLight: '#e3c592',
  suit: '#20363f',
  suitShade: '#16272e',
  suitLight: '#2b4753',
  trousers: '#1c3037',
  blouse: '#f6f0e6',
  blouseShade: '#e3d9c8',
  lips: '#c46f6a',
  lipsLow: '#d4847e',
  iris: '#6b8ea3',
  ink: '#1f2b31',
  shoe: '#1b1b1d',
  pointer: '#d3d9dd',
  pointerEdge: '#2a3035',
  pointerTip: '#ef9f5a',
}

/** One arm drawn hanging down on the viewer's left; the right arm is the same group mirrored. */
function Arm({ side, gradId }: { side: 'L' | 'R'; gradId: string }) {
  return (
    <g data-part={`upper${side}`}>
      <path
        d="M98 204C88 214 85 236 86 262L89 334L115 334L117 262C118 236 117 216 112 206Z"
        fill={C.suit}
      />
      <path d="M90 250C92 290 92 310 91 332L97 332C98 300 97 270 95 246Z" fill={C.suitShade} opacity="0.6" />
      <g data-part={`fore${side}`}>
        <path d="M89 328L115 328L112.5 421L90.5 421Z" fill={C.suit} />
        <path d="M89 328L115 328L114.5 340L89.3 340Z" fill={C.suitShade} opacity="0.5" />
        <path d="M91 418L112 418L111.5 430L91.5 430Z" fill={C.blouse} />
        <g data-part={`hand${side}`}>
          <g data-part={`open${side}`}>
            <path d="M91.5 428C88.5 441 89.5 456 94 466C97 472.5 104 474 108 468C112 460 113 446 111.5 428Z" fill={C.skin} />
            <path d="M109 433C116 439 117.5 449 113.5 455C110.5 452 109.5 445 108 440Z" fill={C.skin} />
            <path d="M97.5 452L98.5 467M102.5 454L103.3 471" stroke={C.skinShade} strokeWidth="1.1" strokeLinecap="round" />
          </g>
          {/* fist holding a telescopic pointer that continues the line of the arm */}
          <g data-part={`point${side}`} opacity="0">
            <path d="M97.6 432L105 432L103.4 528L99.2 528Z" fill={C.pointer} stroke={C.pointerEdge} strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M102.6 462L102.1 524" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
            <path d="M98.6 494H104.2" stroke={C.pointerEdge} strokeWidth="1.3" />
            <circle cx="101.3" cy="531" r="5" fill={C.pointerTip} stroke={C.pointerEdge} strokeWidth="1.2" />
            <path d="M91.5 428C89 440 89.5 452 95.5 458C101.5 462 110 458.5 111.5 448L111.5 428Z" fill={C.skin} />
            <path d="M93 446C97 447.5 103 447.5 109 445M93.5 452.5C98 454 104 454 109.5 451.5" stroke={C.skinShade} strokeWidth="1.1" fill="none" strokeLinecap="round" />
            <path d="M109 433C116 439 117.5 449 113.5 455C110.5 452 109.5 445 108 440Z" fill={C.skin} />
          </g>
          {side === 'R' && (
            <g data-part="tablet" opacity="0">
              <rect x="70" y="438" width="58" height="82" rx="7" fill="#15232a" />
              <rect x="74.5" y="443" width="49" height="72" rx="3" fill={`url(#${gradId})`} />
              <path d="M84 452V500M92 452V486M100 452V494" stroke="#fbf8f3" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
              <path d="M110 452V470" stroke="#ef9f5a" strokeWidth="4" strokeLinecap="round" />
              {/* thumb over the tablet edge */}
              <path d="M109 433C116 439 117.5 449 113.5 455C110.5 452 109.5 445 108 440Z" fill={C.skin} />
            </g>
          )}
        </g>
      </g>
    </g>
  )
}

/** Brooch in the shape of the АРКА 123 icon: silver frame and digits on navy enamel. */
function Brooch({ uid }: { uid: string }) {
  return (
    <g data-part="brooch" transform="translate(183 252) scale(0.031) translate(-625 -642)">
      <path d={ICON_PATHS.window} fill="#183440" />
      <g fill={`url(#${uid}-silver)`}>
        <path d={ICON_SHAPES.frame} fillRule="evenodd" />
        <path d={ICON_SHAPES.two} />
        <path d={ICON_SHAPES.three} />
      </g>
      <path
        data-part="glint"
        d="M880 300L905 375L980 400L905 425L880 500L855 425L780 400L855 375Z"
        fill="#fff"
        opacity="0"
        transform="translate(-60 -40) scale(1.2)"
      />
    </g>
  )
}

/**
 * Anna — the brand host of АРКА 123. Flat editorial illustration in brand colours, built in layers so
 * GSAP can animate shoulders, elbows, wrists, hips, head and eyelids.
 */
export function AnnaSvg({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="0 0 320 860" role="img" aria-label="Анна, хозяйка пространства АРКА 123">
      <defs>
        <linearGradient id={`${uid}-silver`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9d0d5" />
          <stop offset="1" stopColor="#8e989f" />
        </linearGradient>
        <linearGradient id={`${uid}-screen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c4a56" />
          <stop offset="1" stopColor="#20363f" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0.7" stopColor={C.skin} />
          <stop offset="1" stopColor={C.skinShade} />
        </radialGradient>
        <clipPath id={`${uid}-eyeL`}>
          <path d="M131.5 113Q141 105.5 150.5 113Q141 119 131.5 113Z" />
        </clipPath>
        <clipPath id={`${uid}-eyeR`}>
          <path d="M169.5 113Q179 105.5 188.5 113Q179 119 169.5 113Z" />
        </clipPath>
      </defs>

      <ellipse cx="160" cy="834" rx="74" ry="9" fill="#0c171b" opacity="0.2" />

      <g data-part="body">
        {/* legs */}
        <g data-part="legL">
          <path d="M116 428L160 428L156 600C154 680 152 740 152 794L128 794C127 740 124 680 121 600Z" fill={C.trousers} />
          <path d="M139 450L140.5 792" stroke={C.suitShade} strokeWidth="1.6" />
          <rect x="131" y="790" width="18" height="16" fill={C.skin} />
          <path d="M127 801L153 801L155 818C151 833 131 833 125 818Z" fill={C.shoe} />
          <path d="M131 806C138 803 146 803 150 806" stroke="#5a5a60" strokeWidth="1.4" fill="none" />
        </g>
        <g data-part="legR">
          <path d="M160 428L204 428L199 600C196 680 193 740 192 794L168 794C168 740 166 680 164 600Z" fill={C.trousers} />
          <path d="M181 450L179.5 792" stroke={C.suitShade} strokeWidth="1.6" />
          <rect x="171" y="790" width="18" height="16" fill={C.skin} />
          <path d="M167 801L193 801L195 818C189 833 169 833 165 818Z" fill={C.shoe} />
          <path d="M170 806C174 803 182 803 189 806" stroke="#5a5a60" strokeWidth="1.4" fill="none" />
        </g>

        <g data-part="torso">
          {/* bun peeking behind the neck */}
          <circle cx="198" cy="166" r="17" fill={C.hairShade} />
          <path d="M186 158C192 152 204 152 210 160" stroke={C.hair} strokeWidth="3" fill="none" />
          {/* neck */}
          <path d="M147 148L147 194Q160 202 173 194L173 148Z" fill={C.skin} />
          <path d="M147 158Q160 172 173 158L173 170Q160 182 147 170Z" fill={C.skinShade} opacity="0.75" />

          {/* blouse in the V */}
          <path d="M136 184L184 184L173 312L147 312Z" fill={C.blouse} />
          <path d="M150 188L160 212L170 188Z" fill={C.skin} />
          <path d="M141 186L160 216L179 186" stroke={C.blouseShade} strokeWidth="2" fill="none" />

          {/* fitted single-button jacket */}
          <path
            d="M140 186C122 192 104 196 98 210C94 240 100 300 118 350C122 372 112 410 110 450L210 450C208 410 198 372 202 350C220 300 226 240 222 210C216 196 198 192 180 186L160 304Z"
            fill={C.suit}
          />
          <path d="M100 214C98 262 104 312 120 352L130 352C116 302 110 258 112 214Z" fill={C.suitShade} opacity="0.55" />
          <path d="M220 214C222 262 216 312 200 352L190 352C204 302 210 258 208 214Z" fill={C.suitShade} opacity="0.55" />
          <path d="M104 204C118 196 132 192 140 190L136 198C124 200 112 204 104 210Z" fill={C.suitLight} opacity="0.7" />
          <path d="M216 204C202 196 188 192 180 190L184 198C196 200 208 204 216 210Z" fill={C.suitLight} opacity="0.7" />
          {/* lapels */}
          <path d="M140 186L118 232L130 238L124 250L160 304Z" fill={C.suitLight} stroke={C.suitShade} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M180 186L202 232L190 238L196 250L160 304Z" fill={C.suitLight} stroke={C.suitShade} strokeWidth="1.4" strokeLinejoin="round" />
          {/* opening below the button */}
          <path d="M160 338L147 450L173 450Z" fill={C.trousers} />
          <path d="M160 338L147 450M160 338L173 450" stroke={C.suitShade} strokeWidth="1.6" />
          <circle cx="160" cy="332" r="5" fill={C.suitShade} />
          <circle cx="158.6" cy="330.6" r="1.4" fill="#4d6873" />
          <path d="M118 402L145 404M175 404L202 402" stroke={C.suitShade} strokeWidth="2.4" strokeLinecap="round" />
          <Brooch uid={uid} />
        </g>

        {/* head */}
        <g data-part="head">
          <path d="M160 44C197 44 215 74 213 110C212 132 207 150 201 162L119 162C113 150 108 132 107 110C105 74 123 44 160 44Z" fill={C.hairShade} />
          <path d="M160 58C186 58 204 80 204 110C204 140 188 164 160 168C132 164 116 140 116 110C116 80 134 58 160 58Z" fill={`url(#${uid}-face)`} />
          <circle cx="117" cy="131" r="3.4" fill="#f7f2e8" stroke="#d8cdbb" strokeWidth="0.8" />
          <circle cx="203" cy="131" r="3.4" fill="#f7f2e8" stroke="#d8cdbb" strokeWidth="0.8" />
          {/* brows */}
          <path d="M131 99Q141 93.5 151 98" stroke="#8a6946" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M169 98Q179 93.5 189 99" stroke="#8a6946" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          {/* eyes */}
          <g data-part="eyes">
            <path d="M131.5 113Q141 105.5 150.5 113Q141 119 131.5 113Z" fill="#fff" />
            <path d="M169.5 113Q179 105.5 188.5 113Q179 119 169.5 113Z" fill="#fff" />
            <g data-part="irises">
              <g clipPath={`url(#${uid}-eyeL)`}>
                <circle cx="141" cy="112.6" r="4.7" fill={C.iris} />
                <circle cx="141" cy="112.6" r="2.2" fill={C.ink} />
                <circle cx="142.6" cy="111" r="1.1" fill="#fff" />
              </g>
              <g clipPath={`url(#${uid}-eyeR)`}>
                <circle cx="179" cy="112.6" r="4.7" fill={C.iris} />
                <circle cx="179" cy="112.6" r="2.2" fill={C.ink} />
                <circle cx="180.6" cy="111" r="1.1" fill="#fff" />
              </g>
            </g>
            <path d="M130.5 113.4Q141 104.5 151 112.4M129 112L131.5 110.2" stroke="#3a2f2a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M169 112.4Q179 104.5 189.5 113.4M191 112L188.5 110.2" stroke="#3a2f2a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
          <path d="M158.5 117Q156.4 128 154.5 133Q158.4 136.4 162.6 134.2" stroke="#c98f78" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <ellipse cx="136" cy="131" rx="9" ry="5" fill="#f0a49a" opacity="0.32" />
          <ellipse cx="184" cy="131" rx="9" ry="5" fill="#f0a49a" opacity="0.32" />
          {/* calm half-smile */}
          <g data-part="mouth">
            <path d="M148.5 147Q154 142.6 160 144.6Q166 142.6 171.5 147Q160 150 148.5 147Z" fill={C.lips} />
            <path d="M149.5 147.4Q160 156 170.5 147.4Q160 150.4 149.5 147.4Z" fill={C.lipsLow} />
            <path d="M147.5 146.2Q148.5 148.4 150 148.2M172.5 146.2Q171.5 148.4 170 148.2" stroke="#b2645f" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
          {/* sleek hair with a side part, pulled back into a low bun */}
          <path
            d="M146 47C177 42 207 62 209 102C203 85 191 74 172 72C158 71 150 74 146 79C140 73 128 77 120 89C116 95 114 101 113 107C110 78 124 51 146 47Z"
            fill={C.hair}
          />
          <path d="M150 52C172 50 196 64 204 92M140 54C126 62 118 78 116 98" stroke={C.hairShade} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M160 50C182 50 200 66 206 88" stroke={C.hairLight} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M146 49L146 79" stroke={C.hairShade} strokeWidth="1.2" />
        </g>

        {/* arms */}
        <Arm side="L" gradId={`${uid}-screen`} />
        <g transform="translate(320 0) scale(-1 1)">
          <Arm side="R" gradId={`${uid}-screen`} />
        </g>
      </g>
    </svg>
  )
}
