
'use client'

import { useParams } from "next/navigation";
import { ResidenceBlockProvider } from "src/auth/context/manage-block-residence-context/ManageBlockResidenceContext";

import ManageBlockResidencesView from "src/sections/manage-block-residences/ManageBlockResidencesView";


export default function ManageBlockPage() {


    const { id } = useParams();


    return <ResidenceBlockProvider><ManageBlockResidencesView id={id} /></ResidenceBlockProvider>
}