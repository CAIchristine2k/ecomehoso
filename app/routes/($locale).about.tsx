import {useConfig} from '~/utils/themeContext';
import {type MetaFunction, Link} from 'react-router';
import {getConfig} from '~/utils/config';

export const meta: MetaFunction = () => {
  const config = getConfig();
  return [{title: `${config.brandName} | About ${config.influencerName}`}];
};

export default function About() {
  const config = useConfig();

  return (
    <div className="py-24" style={{backgroundColor: 'var(--color-cream)'}}>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-sm text-sm font-bold tracking-wider uppercase mb-4" style={{backgroundColor: 'var(--color-cream-warm)', color: 'var(--color-matcha-mid)'}}>
            About
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--color-charcoal)'}}>
            The Story of{' '}
            <span style={{color: 'var(--color-matcha-mid)'}}>{config.influencerName}</span>
          </h1>
          <p className="max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--color-stone)'}}>
            {config.influencerTitle} and boxing legend with a career spanning
            decades.
          </p>
        </div>

        {/* Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-6 border-l-4 pl-4" style={{color: 'var(--color-charcoal)', borderColor: 'var(--color-matcha-mid)'}}>
              The Champion's Journey
            </h2>
            <div className="prose prose-lg max-w-none" style={{color: 'var(--color-stone)'}}>
              <p>{config.influencerBio}</p>
              <p>
                Throughout his illustrious career, {config.influencerName} has
                faced the world's best boxers and established himself as one of
                the greatest fighters of his generation. His lightning-fast hand
                speed, technical precision, and relentless work ethic earned him
                the respect of fans and peers alike.
              </p>
              <p>
                Beyond his accomplishments in the ring, {config.influencerName}{' '}
                has become an entrepreneur and brand ambassador, bringing his
                championship mentality to new ventures. This exclusive
                collection represents the culmination of his boxing knowledge
                and passion for excellence.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-sm" style={{border: '1px solid var(--color-cream-dark)'}}>
              <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: 'var(--color-cream-warm)'}}>
                <span className="text-lg" style={{color: 'var(--color-matcha-mid)'}}>
                  {config.influencerName} Portrait
                </span>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 w-3/4 h-3/4 -z-10 rounded-sm" style={{backgroundColor: 'var(--color-cream-warm)'}}></div>
            <div className="absolute -top-8 -right-8 w-1/2 h-1/2 -z-10 rounded-sm" style={{backgroundColor: 'var(--color-cream-warm)'}}></div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{color: 'var(--color-charcoal)'}}>
            Championship <span style={{color: 'var(--color-matcha-mid)'}}>Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-sm" style={{border: '1px solid var(--color-cream-dark)'}}>
              <div className="text-4xl font-bold mb-4" style={{color: 'var(--color-matcha-mid)'}}>01</div>
              <h3 className="text-xl font-bold mb-2" style={{color: 'var(--color-charcoal)'}}>Excellence</h3>
              <p style={{color: 'var(--color-stone)'}}>
                Striving for perfection in every product, just as{' '}
                {config.influencerName} did in the ring.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm" style={{border: '1px solid var(--color-cream-dark)'}}>
              <div className="text-4xl font-bold mb-4" style={{color: 'var(--color-matcha-mid)'}}>02</div>
              <h3 className="text-xl font-bold mb-2" style={{color: 'var(--color-charcoal)'}}>Authenticity</h3>
              <p style={{color: 'var(--color-stone)'}}>
                Every product reflects the true spirit and legacy of{' '}
                {config.influencerName}'s career.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm" style={{border: '1px solid var(--color-cream-dark)'}}>
              <div className="text-4xl font-bold mb-4" style={{color: 'var(--color-matcha-mid)'}}>03</div>
              <h3 className="text-xl font-bold mb-2" style={{color: 'var(--color-charcoal)'}}>Innovation</h3>
              <p style={{color: 'var(--color-stone)'}}>
                Combining traditional boxing wisdom with modern technology and
                design.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--color-charcoal)'}}>
            Experience the legacy of {config.influencerName}
          </h2>
          <p className="max-w-2xl mx-auto mb-8" style={{color: 'var(--color-stone)'}}>
            Browse our exclusive collection of premium products designed with
            the champion's touch.
          </p>
          <Link
            to="/collections/all"
            className="inline-block font-bold py-3 px-8 rounded-sm transition-colors text-white"
            style={{backgroundColor: 'var(--color-matcha-mid)'}}
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
