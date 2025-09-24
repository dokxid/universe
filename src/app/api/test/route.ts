import experiences from "@/types/models/experiences";

const query = await experiences
    .aggregate([
        { $unwind: "$stories" },
        {
            $match: {
                "stories.story": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [-73.9667, 40.78],
                        },
                        $minDistance: 0,
                        $maxDistance: 10000,
                    },
                },
            },
        },
    ])
    .exec();

export async function GET() {
    return new Response(JSON.stringify(query), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
