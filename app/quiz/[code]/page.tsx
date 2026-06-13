interface Props {
    params: {
        code: string;
    };
}

export default function QuizPage(
    { params }: Props
) {

    return (

        <main className="flex min-h-screen items-center justify-center">

            <h1 className="text-4xl">

                Quiz Running
                <br />
                Code:
                {" "}
                {params.code}

            </h1>

        </main>

    );

}