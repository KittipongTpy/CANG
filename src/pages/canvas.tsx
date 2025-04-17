
import DefaultLayout from "@/layouts/default";
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import "./customGutter.css"
import { Snippet, ScrollShadow, Card, CardHeader, CardBody, Image, CardFooter, Button, Tabs, Tab } from "@heroui/react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
export default function App() {


    return (
        <DefaultLayout>
            <Splitter direction={SplitDirection.Horizontal} gutterClassName="custom-gutter-horizontal"
                draggerClassName="custom-dragger-horizontal" initialSizes={[60, 40]}>
                <div className="h-full">
                    <Card className="py-4 h-full">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <p className="text-tiny uppercase font-bold">Daily Mix</p>
                            <small className="text-default-500">12 Tracks</small>
                            <h4 className="font-bold text-large">Frontend Radio</h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                            <Image
                                alt="Card background"
                                className="object-cover rounded-xl"
                                src="https://heroui.com/images/hero-card-complete.jpeg"
                                width={270}
                            />
                        </CardBody>
                    </Card>
                </div>
                <div className="h-full pb-8">
                    <Tabs aria-label="Options" >
                        <Tab key="Code" title="Code" className="h-full">
                            <Card className="pt-4 h-full">
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                    <h4 className="font-bold text-large">Edit Your CAD Code</h4>
                                </CardHeader>
                                <CardBody className="overflow-visible py-2 h-full">
                                    <CodeMirror
                                        height="100%"
                                        theme={vscodeDark}
                                    />
                                </CardBody>
                                <CardFooter className="bg-white/10 bottom-0 border-t-10 flex justify-end">
                                    <Button className="text-tiny" color="primary" radius="full" size="sm">
                                        Run
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Tab>
                        <Tab key="Syntax" title="Syntax">
                            <Card>
                                <CardBody>
                                    <ScrollShadow className="w-full h-[510px]">
                                        <p>
                                            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
                                            consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim
                                            nostrud elit officia tempor esse quis.
                                        </p>
                                        <Snippet>npm install @heroui/react</Snippet>
                                        <p>
                                            Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor
                                            cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum
                                            quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit
                                            incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                                            deserunt nostrud ad veniam.
                                        </p>
                                        <Snippet>npm install @heroui/react</Snippet>
                                        <p>
                                            Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor
                                            cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum
                                            quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit
                                            incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                                            deserunt nostrud ad veniam.
                                        </p>
                                        <p>
                                            Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor
                                            cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum
                                            quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit
                                            incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                                            deserunt nostrud ad veniam.
                                        </p>




                                    </ScrollShadow>
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>

                </div>
            </Splitter>


        </DefaultLayout>

    );
}
