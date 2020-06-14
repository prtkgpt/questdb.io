import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import CustomCodeBlock from '../components/CustomCodeBlock'


const installDocker = `
docker pull questdb/questdb
docker create --name questdb -p 9000:9000 questdb/questdb
docker start questdb
`.trim()

const searchTime = `
SELECT timestamp, tempC 
FROM sensors 
WHERE timestamp = '2020-06-14;-2d';
`.trim()

const sliceByTime = `
SELECT timestamp, avg(tempC) 
FROM sensors 
SAMPLE BY 5m;
`.trim()

const latestBy = `
SELECT sensorName, tempC 
FROM sensors 
LATEST BY sensorName;
`.trim()

const asof = `
SELECT timestamp, tempC, cpuUsage 
FROM tempReadings 
ASOF JOIN usageReadings;
`.trim()


const features = [
    {
        title: <center>Raw power</center>,
        imageUrl: 'img/fast.svg',
        description: (
            <>
                - millions of writes per secomd... per thread
                <br/>
                - SIMD boosted aggregations
                <br/>
                - Non-blocking threading model
            </>
        ),
    },
    {
        title: <center>Easy to use</center>,
        imageUrl: 'img/easy.svg',
        description: (
            <>
                - SQL language, augmented for time-series
                <br/>
                - Postgres wire (beta)
                <br/>
                - Influx Line Protocol
            </>
        ),
    },
    {
        title: <center>Feature rich</center>,
        imageUrl: 'img/feat.svg',
        description: (
            <>
                - Relational and time-based joins
                <br/>
                - Unlimited transaction size
                <br/>
                - Blob support
            </>
        ),
    },
];

function Feature({imageUrl, title, description}) {
    const imgUrl = useBaseUrl(imageUrl);
    return (
        <div className={classnames('col col--4', styles.feature)}>
            {imgUrl && (
                <div className="text--center">
                    <img className={styles.featureImage} src={imgUrl} alt={title}/>
                </div>
            )}
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}


function Home() {
    const context = useDocusaurusContext();
    const {siteConfig = {}} = context;
    return (
        <Layout
            title={`QuestDB`}
            description="Description will go into a meta tag in <head />">

            <header className={classnames('hero hero--primary', styles.heroBanner)}>
                <div className="col col--5">
                    <h1 className="hero__title">{siteConfig.title}</h1>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div className={styles.buttons}>
                        <Link
                            className={classnames(
                                'button button--outline button--secondary button--lg',
                                styles.getStarted,
                            )}
                            to={useBaseUrl('docs/')}>
                            Get Started
                        </Link>
                        <Link
                            className={classnames(
                                'button button--outline button--secondary button--lg',
                                styles.getStarted,
                            )}
                            to={useBaseUrl('docs/')}>
                            Github
                        </Link>
                    </div>
                </div>

                <div className="col col--5">
                    <div className="container">
                        <CustomCodeBlock header="Get started in 3 steps" js={installDocker}/>
                    </div>
                </div>
            </header>
            <main>


                {features && features.length > 0 && (
                    <section className={styles.features}>
                        <div className="container">
                            <div className="row">
                                {features.map((props, idx) => (
                                    <Feature key={idx} {...props} />
                                ))}
                            </div>
                        </div>
                    </section>


                )}


                <section className={'section-lg'}>
                    <center>
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--6 col--offset-3">
                                <h2 className="with-underline">SQL - augmented for time-series</h2>
                                <p className="">
                                    QuestDB enhances ANSI SQL with time-series extensions to manipulate timestamped
                                    data in an efficient way which avoids verbose.
                                </p>
                            </div>
                        </div>
                    </center>


                    <br/>

                    <div className="container">
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--2">
                                <h2>Search time</h2>
                            </div>
                            <div className="col col--4">
                                Search time intervals with the most efficient language form.
                            </div>
                            <div className="col col--6">
                                <CustomCodeBlock js={searchTime}/>
                            </div>
                        </div>
                    </div>

                    <br/>

                    <div className="container">
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--2">
                                <h2>Slice time</h2>
                            </div>
                            <div className="col col--4">
                                Create time buckets and aggregate by intervals with <b>SAMPLE BY</b>
                            </div>
                            <div className="col col--6">
                                <CustomCodeBlock js={sliceByTime}/>
                            </div>
                        </div>
                    </div>

                    <br/>

                    <div className="container">
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--2">
                                <h2>Navigate time</h2>
                            </div>
                            <div className="col col--4">
                                Replay events and reproduce state at any point in time using <b>LATEST BY</b>
                            </div>
                            <div className="col col--6">
                                <CustomCodeBlock js={latestBy}/>
                            </div>
                        </div>
                    </div>

                    <br/>

                    <div className="container">
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--2">
                                <h2>Merge time</h2>
                            </div>
                            <div className="col col--4">
                                Instantly combine and join time-series with different timestamps using <b>ASOF JOIN</b>
                            </div>
                            <div className="col col--6">
                                <CustomCodeBlock js={asof}/>
                            </div>
                        </div>
                    </div>

                    <center>
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--6 col--offset-3">
                                <br/>
                                <h2 className="with-underline">and more..</h2>
                            </div>
                        </div>
                    </center>

                </section>




                <section className={'section-lg'}>
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--3 col--offset-1">
                                <h2 className="with-underline"> QuestDB is</h2>
                                <p className="">
                                    - Column oriented
                                    <br/>
                                    - Relational model, using SQL
                                    <br/>
                                    - Disk persisted
                                    <br/>
                                    - Non-blocking read/write
                                    <br/>
                                    - constantly ingesting with O(1) complexity
                                </p>
                            </div>

                            <div className="col col--3">
                                <h2 className="with-underline"> QuestDB is good for</h2>
                                <p className="">
                                    - Write heavy workloads
                                    <br/>
                                    - Instant analytics on large datasets
                                    <br/>
                                    - High concurrency environments with multiple readers and writers
                                    <br/>
                                    - Latency sensitive applications
                                </p>
                            </div>

                        <div className="col col--3">
                            <h2 className="with-underline"> QuestDB is NOT</h2>
                            <p className="">
                                - A NoSQL database or a key-value store
                                <br/>
                                - An in-memory database
                            </p>
                        </div>
                        </div>
                </section>



                <section className={'section-lg'}>
                    <div className="container">
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--6 col--offset-3">
                                <center>
                                <h2 className="with-underline">Interactive console</h2>
                                <p className="">
                                    QuestDB ships with an interactive web console which allows you to
                                    import data with a simple drag and drop, and to start querying right away.
                                </p>
                        </center>
                            </div>
                        </div>

                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col">
                                <img
                                    className={'web-console'}
                                    src={'/img/questdb-console-new.png'}
                                    alt={'Web Console'}
                                />
                            </div>
                        </div>
                    </div>
                </section>


                <section className={'section-lg'}>
                    <div className="container">
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--2">
                                <img
                                    className={'pgicon'}
                                    src={'/img/pgicon.png'}
                                    alt={'postgres sql'}
                                />
                            </div>
                            <div className="col col--3">
                                <h2 className="with-underline">Postgres wire support (beta)</h2>
                                <p className="">
                                    Interact with QuestDB using the postgres wire and any tool that connects to it.
                                </p>
                            </div>
                            <div className="col col--7">
                                <img
                                    className={'psql'}
                                    src={'/img/psql.png'}
                                    alt={'postgres sql'}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className={'section-lg'}>
                    <div className="container">
                        <div className={classnames('row', styles.responsiveCentered)}>
                            <div className="col col--2">
                                <img
                                    className={'ossicon'}
                                    src={'/img/ossicon.svg'}
                                    alt={'github'}
                                />
                            </div>
                            <div className="col col--4">
                                <h2 className="with-underline">Open Source</h2>
                                <p className="">
                                    QuestDB is Open Source. Follow us on Github. Watch the repo to get notified of
                                    further releases and new features!
                                </p>
                            </div>
                            <div className="col col--2">
                                <img
                                    className={'ghicon'}
                                    src={'/img/github.svg'}
                                    alt={'github'}
                                />
                                <br/>
                                <div className={styles.buttons}>
                                    <Link
                                        className={classnames(
                                            'button button--outline button--secondary button--lg',
                                            styles.getStarted,
                                        )}
                                        to={useBaseUrl('docs/')}>
                                        Go to Github
                                    </Link>
                                </div>
                            </div>
                            <div className="col col--2">
                                <img
                                    className={'slackicon'}
                                    src={'/img/slack.svg'}
                                    alt={'slack'}
                                />
                                <br/>
                                <div className={styles.buttons}>
                                    <Link
                                        className={classnames(
                                            'button button--outline button--secondary button--lg',
                                            styles.getStarted,
                                        )}
                                        to={useBaseUrl('docs/')}>
                                        Join Slack
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={'section-lg'}>
                </section>

            </main>
        </Layout>
    );
}

export default Home;
