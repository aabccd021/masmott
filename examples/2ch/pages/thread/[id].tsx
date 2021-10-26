/* istanbul ignore file */
import { spec, ThreadPageData } from '../../generated';
import { ViewPath } from '../../masmott';
import { makeGetStaticPaths, makeGetStaticProps } from '../../masmott/fetching';
import { withISR as makeISRPage } from '../../masmott/isr';
import Page from '../../page-components/thread/[id]';
const viewPath: ViewPath = ['thread', 'page'];
const ISRPage = makeISRPage<ThreadPageData>(viewPath, spec.thread.views.page, Page);
export default ISRPage;
export const getStaticPaths = makeGetStaticPaths();
export const getStaticProps = makeGetStaticProps(viewPath);
