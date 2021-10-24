import { ViewPath } from "../../masmott";
import { makeGetStaticPaths, makeGetStaticProps } from "../../masmott/fetching";
import { withISR as makeISRPage } from "../../masmott/isr";
import Page from "../../page-components/thread/[id]";
const viewPath: ViewPath = ["thread", "page"];
const ISRPage = makeISRPage(viewPath, Page);
export default ISRPage;
export const getStaticPaths = makeGetStaticPaths();
export const getStaticProps = makeGetStaticProps(viewPath);
